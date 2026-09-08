import { RoleName, UserStatus } from '@prisma/client';

// ── Request DTOs ────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'TOURIST' | 'GUIDE' | 'HOMESTAY';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailInput {
  token: string;
}

// ── Response DTOs ───────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: AuthTokens;
}

export interface UserResponse {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  status: UserStatus;
  emailVerified: boolean;
  role: {
    name: RoleName;
  };
  permissions: string[];
  lastLoginAt: Date | null;
  createdAt: Date;
}

// ── JWT Payload ─────────────────────────────────────────────

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  type: 'refresh';
}
