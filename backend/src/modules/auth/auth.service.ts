import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { RoleName, UserStatus, VerificationTokenType } from '@prisma/client';

import { config } from '../../config';
import { logger } from '../../common/logger';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../common/errors/AppError';

import { authRepository, AuthRepository } from './auth.repository';
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
  AuthTokens,
  UserResponse,
  AccessTokenPayload,
  RefreshTokenPayload,
  ChangePasswordInput,
} from './auth.types';
import {
  AUTH_ERRORS,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MINUTES,
  VERIFICATION_TOKEN_EXPIRY_HOURS,
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
} from './auth.constants';

export class AuthService {
  private repo: AuthRepository;

  constructor(repo?: AuthRepository) {
    this.repo = repo || authRepository;
  }

  // ══════════════════════════════════════════════════════════════
  //  REGISTRATION
  // ══════════════════════════════════════════════════════════════

  async register(input: RegisterInput): Promise<{ user: UserResponse; verificationToken: string }> {
    // Check if email already exists
    const existingUser = await this.repo.findUserByEmail(input.email);
    if (existingUser) {
      throw new ConflictError(AUTH_ERRORS.EMAIL_ALREADY_EXISTS.message, AUTH_ERRORS.EMAIL_ALREADY_EXISTS.code);
    }

    // Check if phone already exists
    if (input.phone) {
      const existingPhone = await this.repo.findUserByPhone(input.phone);
      if (existingPhone) {
        throw new ConflictError(AUTH_ERRORS.PHONE_ALREADY_EXISTS.message, AUTH_ERRORS.PHONE_ALREADY_EXISTS.code);
      }
    }

    // Find the role
    const role = await this.repo.findRoleByName(input.role as RoleName);
    if (!role) {
      throw new BadRequestError(AUTH_ERRORS.ROLE_NOT_FOUND.message, AUTH_ERRORS.ROLE_NOT_FOUND.code);
    }

    // Hash password
    const passwordHash = await this.hashPassword(input.password);

    // Create user
    const user = await this.repo.createUser({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      roleId: role.id,
    });

    // Create verification token
    const verificationToken = this.generateRandomToken();
    const tokenHash = this.hashToken(verificationToken);

    await this.repo.createVerificationToken({
      userId: user.id,
      tokenHash,
      type: VerificationTokenType.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000),
    });

    logger.info('User registered successfully', { userId: user.id, email: input.email });

    // Log verification token for development (in production, this would be sent via email)
    logger.info(`[DEV] Email verification token for ${input.email}: ${verificationToken}`);

    return {
      user: this.formatUserResponse(user),
      verificationToken,
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  LOGIN
  // ══════════════════════════════════════════════════════════════

  async login(
    input: LoginInput,
    meta: { userAgent?: string; ipAddress?: string }
  ): Promise<AuthResponse> {
    // Find user — use generic error to prevent credential enumeration
    const user = await this.repo.findUserByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS.message, AUTH_ERRORS.INVALID_CREDENTIALS.code);
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedError(AUTH_ERRORS.ACCOUNT_LOCKED.message, AUTH_ERRORS.ACCOUNT_LOCKED.code);
    }

    // Check account status
    this.validateAccountStatus(user.status);

    // Verify password
    const isValid = await this.verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      // Increment login attempts
      const attempts = user.loginAttempts + 1;
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
        await this.repo.lockUser(user.id, lockUntil);
        logger.warn('Account locked due to too many failed attempts', {
          userId: user.id,
          attempts,
        });
      } else {
        await this.repo.incrementLoginAttempts(user.id);
      }
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS.message, AUTH_ERRORS.INVALID_CREDENTIALS.code);
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await this.repo.resetLoginAttempts(user.id);
    }

    // Update last login
    await this.repo.updateUser(user.id, { lastLoginAt: new Date() });

    // Generate tokens
    const permissions = user.role.rolePermissions.map((rp) => rp.permission.name);
    const tokens = await this.generateTokens(user.id, user.email, user.role.name, permissions, meta);

    logger.info('User logged in', { userId: user.id, email: user.email });

    return {
      user: this.formatUserResponse(user),
      tokens,
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  LOGOUT
  // ══════════════════════════════════════════════════════════════

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    const session = await this.repo.findSessionByTokenHash(tokenHash);

    if (session) {
      await this.repo.revokeSession(session.id);
      logger.info('User logged out', { sessionId: session.id, userId: session.userId });
    }
  }

  // ══════════════════════════════════════════════════════════════
  //  TOKEN REFRESH
  // ══════════════════════════════════════════════════════════════

  async refreshTokens(
    refreshToken: string,
    _meta: { userAgent?: string; ipAddress?: string }
  ): Promise<AuthTokens> {
    // Verify refresh token JWT
    let payload: RefreshTokenPayload;
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_REFRESH_TOKEN.message, AUTH_ERRORS.INVALID_REFRESH_TOKEN.code);
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_REFRESH_TOKEN.message, AUTH_ERRORS.INVALID_REFRESH_TOKEN.code);
    }

    // Find session
    const tokenHash = this.hashToken(refreshToken);
    const session = await this.repo.findSessionByTokenHash(tokenHash);

    if (!session || session.id !== payload.sessionId) {
      // Possible token reuse — revoke all user sessions
      if (payload.userId) {
        await this.repo.revokeAllUserSessions(payload.userId);
        logger.warn('Possible refresh token reuse detected, revoking all sessions', {
          userId: payload.userId,
        });
      }
      throw new UnauthorizedError(AUTH_ERRORS.SESSION_REVOKED.message, AUTH_ERRORS.SESSION_REVOKED.code);
    }

    // Get user
    const user = await this.repo.findUserById(session.userId);
    if (!user) {
      await this.repo.revokeSession(session.id);
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_CREDENTIALS.message, AUTH_ERRORS.INVALID_CREDENTIALS.code);
    }

    // Check account status
    this.validateAccountStatus(user.status);

    // Rotate refresh token
    const permissions = user.role.rolePermissions.map((rp) => rp.permission.name);
    const accessToken = this.generateAccessToken(user.id, user.email, user.role.name, permissions);
    const newRefreshToken = this.generateRefreshToken(user.id, session.id);
    const newTokenHash = this.hashToken(newRefreshToken);
    const expiresAt = this.getRefreshTokenExpiry();

    await this.repo.updateSessionToken(session.id, newTokenHash, expiresAt);

    logger.info('Token refreshed', { userId: user.id, sessionId: session.id });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: config.jwt.accessExpiresIn,
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  EMAIL VERIFICATION
  // ══════════════════════════════════════════════════════════════

  async verifyEmail(token: string): Promise<{ message: string }> {
    const tokenHash = this.hashToken(token);
    const verificationToken = await this.repo.findVerificationToken(
      tokenHash,
      VerificationTokenType.EMAIL_VERIFICATION
    );

    if (!verificationToken) {
      throw new BadRequestError(
        AUTH_ERRORS.INVALID_VERIFICATION_TOKEN.message,
        AUTH_ERRORS.INVALID_VERIFICATION_TOKEN.code
      );
    }

    // Check if user is already verified
    const user = await this.repo.findUserById(verificationToken.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestError(AUTH_ERRORS.ALREADY_VERIFIED.message, AUTH_ERRORS.ALREADY_VERIFIED.code);
    }

    // Mark token as used and verify user
    await this.repo.markTokenUsed(verificationToken.id);
    await this.repo.updateUser(verificationToken.userId, {
      emailVerified: true,
      status: UserStatus.ACTIVE,
    });

    logger.info('Email verified', { userId: verificationToken.userId });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  // ══════════════════════════════════════════════════════════════
  //  FORGOT PASSWORD
  // ══════════════════════════════════════════════════════════════

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    // Always return success to prevent email enumeration
    const user = await this.repo.findUserByEmail(email);
    const successMessage = 'If an account with that email exists, a password reset link has been sent.';

    if (!user) {
      return { message: successMessage };
    }

    // Invalidate existing reset tokens
    await this.repo.invalidateUserTokens(user.id, VerificationTokenType.PASSWORD_RESET);

    // Generate reset token
    const resetToken = this.generateRandomToken();
    const tokenHash = this.hashToken(resetToken);

    await this.repo.createVerificationToken({
      userId: user.id,
      tokenHash,
      type: VerificationTokenType.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000),
    });

    logger.info('Password reset requested', { userId: user.id, email });
    logger.info(`[DEV] Password reset token for ${email}: ${resetToken}`);

    return { message: successMessage, resetToken };
  }

  // ══════════════════════════════════════════════════════════════
  //  RESET PASSWORD
  // ══════════════════════════════════════════════════════════════

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const tokenHash = this.hashToken(token);
    const resetToken = await this.repo.findVerificationToken(
      tokenHash,
      VerificationTokenType.PASSWORD_RESET
    );

    if (!resetToken) {
      throw new BadRequestError(
        AUTH_ERRORS.INVALID_RESET_TOKEN.message,
        AUTH_ERRORS.INVALID_RESET_TOKEN.code
      );
    }

    // Hash new password
    const passwordHash = await this.hashPassword(newPassword);

    // Update password and mark token as used
    await this.repo.updateUser(resetToken.userId, { passwordHash });
    await this.repo.markTokenUsed(resetToken.id);

    // Revoke all sessions for security
    await this.repo.revokeAllUserSessions(resetToken.userId);

    logger.info('Password reset successful', { userId: resetToken.userId });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  // ══════════════════════════════════════════════════════════════
  //  CHANGE PASSWORD
  // ══════════════════════════════════════════════════════════════

  async changePassword(userId: string, input: ChangePasswordInput): Promise<{ message: string }> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isValid = await this.verifyPassword(input.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestError(AUTH_ERRORS.PASSWORD_MISMATCH.message, AUTH_ERRORS.PASSWORD_MISMATCH.code);
    }

    // Check new password is different
    const isSame = await this.verifyPassword(input.newPassword, user.passwordHash);
    if (isSame) {
      throw new BadRequestError(AUTH_ERRORS.SAME_PASSWORD.message, AUTH_ERRORS.SAME_PASSWORD.code);
    }

    // Hash and update
    const passwordHash = await this.hashPassword(input.newPassword);
    await this.repo.updateUser(userId, { passwordHash });

    logger.info('Password changed', { userId });

    return { message: 'Password changed successfully.' };
  }

  // ══════════════════════════════════════════════════════════════
  //  GET CURRENT USER
  // ══════════════════════════════════════════════════════════════

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.formatUserResponse(user);
  }

  // ══════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  private generateAccessToken(
    userId: string,
    email: string,
    role: string,
    permissions: string[]
  ): string {
    const payload: AccessTokenPayload = {
      userId,
      email,
      role,
      permissions,
      type: 'access',
    };

    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn as any,
    });
  }

  private generateRefreshToken(userId: string, sessionId: string): string {
    const payload: RefreshTokenPayload = {
      userId,
      sessionId,
      type: 'refresh',
    };

    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as any,
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    permissions: string[],
    meta: { userAgent?: string; ipAddress?: string }
  ): Promise<AuthTokens> {
    // Create session first to get session ID
    const refreshTokenPlaceholder = this.generateRandomToken();
    const placeholderHash = this.hashToken(refreshTokenPlaceholder);
    const expiresAt = this.getRefreshTokenExpiry();

    const session = await this.repo.createSession({
      userId,
      refreshTokenHash: placeholderHash,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt,
    });

    // Generate actual tokens with session ID
    const accessToken = this.generateAccessToken(userId, email, role, permissions);
    const refreshToken = this.generateRefreshToken(userId, session.id);

    // Update session with actual refresh token hash
    const actualHash = this.hashToken(refreshToken);
    await this.repo.updateSessionToken(session.id, actualHash, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.accessExpiresIn,
    };
  }

  private generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getRefreshTokenExpiry(): Date {
    const daysMatch = config.jwt.refreshExpiresIn.match(/^(\d+)d$/);
    const days = daysMatch ? parseInt(daysMatch[1]) : 7;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private validateAccountStatus(status: UserStatus): void {
    switch (status) {
      case UserStatus.PENDING_VERIFICATION:
        throw new UnauthorizedError(AUTH_ERRORS.ACCOUNT_NOT_VERIFIED.message, AUTH_ERRORS.ACCOUNT_NOT_VERIFIED.code);
      case UserStatus.SUSPENDED:
        throw new ForbiddenError(AUTH_ERRORS.ACCOUNT_SUSPENDED.message, AUTH_ERRORS.ACCOUNT_SUSPENDED.code);
      case UserStatus.BLOCKED:
        throw new ForbiddenError(AUTH_ERRORS.ACCOUNT_BLOCKED.message, AUTH_ERRORS.ACCOUNT_BLOCKED.code);
      case UserStatus.DEACTIVATED:
        throw new ForbiddenError(AUTH_ERRORS.ACCOUNT_DEACTIVATED.message, AUTH_ERRORS.ACCOUNT_DEACTIVATED.code);
      case UserStatus.ACTIVE:
        return;
    }
  }

  private formatUserResponse(user: any): UserResponse {
    const permissions = user.role?.rolePermissions?.map((rp: any) => rp.permission.name) || [];

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      emailVerified: user.emailVerified,
      role: {
        name: user.role?.name || user.roleName,
      },
      permissions,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
