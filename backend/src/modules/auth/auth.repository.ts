import { PrismaClient, RoleName, UserStatus, VerificationTokenType, User } from '@prisma/client';
import { prisma } from '../../database/client';

type UserWithRole = User & {
  role: {
    name: RoleName;
    rolePermissions: {
      permission: {
        name: string;
      };
    }[];
  };
};

export class AuthRepository {
  private db: PrismaClient;

  constructor(db?: PrismaClient) {
    this.db = db || prisma;
  }

  // ── User Queries ────────────────────────────────────────────

  async findUserByEmail(email: string): Promise<UserWithRole | null> {
    return this.db.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { name: true } },
              },
            },
          },
        },
      },
    }) as Promise<UserWithRole | null>;
  }

  async findUserById(id: string): Promise<UserWithRole | null> {
    return this.db.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { name: true } },
              },
            },
          },
        },
      },
    }) as Promise<UserWithRole | null>;
  }

  async findUserByPhone(phone: string) {
    return this.db.user.findUnique({ where: { phone } });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roleId: string;
    status?: UserStatus;
    emailVerified?: boolean;
  }) {
    return this.db.user.create({
      data: {
        status: data.status ?? UserStatus.ACTIVE,
        emailVerified: data.emailVerified ?? true,
        ...data,
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }

  async updateUser(
    id: string,
    data: Partial<{
      passwordHash: string;
      status: UserStatus;
      emailVerified: boolean;
      phoneVerified: boolean;
      loginAttempts: number;
      lockedUntil: Date | null;
      lastLoginAt: Date;
    }>
  ) {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  async incrementLoginAttempts(id: string) {
    return this.db.user.update({
      where: { id },
      data: {
        loginAttempts: { increment: 1 },
      },
    });
  }

  async resetLoginAttempts(id: string) {
    return this.db.user.update({
      where: { id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async lockUser(id: string, until: Date) {
    return this.db.user.update({
      where: { id },
      data: {
        lockedUntil: until,
        loginAttempts: 0,
      },
    });
  }

  // ── Role Queries ────────────────────────────────────────────

  async findRoleByName(name: RoleName) {
    return this.db.role.findUnique({ where: { name } });
  }

  // ── Session Queries ─────────────────────────────────────────

  async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return this.db.session.create({ data });
  }

  async findSessionByTokenHash(hash: string) {
    return this.db.session.findFirst({
      where: {
        refreshTokenHash: hash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findSessionById(id: string) {
    return this.db.session.findUnique({ where: { id } });
  }

  async revokeSession(id: string) {
    return this.db.session.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserSessions(userId: string) {
    return this.db.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async updateSessionToken(id: string, newTokenHash: string, expiresAt: Date) {
    return this.db.session.update({
      where: { id },
      data: { refreshTokenHash: newTokenHash, expiresAt },
    });
  }

  async deleteExpiredSessions() {
    return this.db.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true },
        ],
      },
    });
  }

  // ── Verification Token Queries ──────────────────────────────

  async createVerificationToken(data: {
    userId: string;
    tokenHash: string;
    type: VerificationTokenType;
    expiresAt: Date;
  }) {
    return this.db.verificationToken.create({ data });
  }

  async findVerificationToken(tokenHash: string, type: VerificationTokenType) {
    return this.db.verificationToken.findFirst({
      where: {
        tokenHash,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markTokenUsed(id: string) {
    return this.db.verificationToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async invalidateUserTokens(userId: string, type: VerificationTokenType) {
    return this.db.verificationToken.updateMany({
      where: {
        userId,
        type,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });
  }
}

export const authRepository = new AuthRepository();
