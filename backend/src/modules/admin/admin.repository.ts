// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 8: Admin Repository
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../../database/client';
import { Prisma } from '@prisma/client';
import {
  QueryUsersParams,
  UpdateUserStatusInput,
  CreateRoleInput,
  UpdateRoleInput,
  QueryAuditLogsParams,
  UpdateSystemSettingInput,
  QueryAdminReportsParams,
} from './admin.types';

export const USER_SAFE_SELECT = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  status: true,
  emailVerified: true,
  phoneVerified: true,
  loginAttempts: true,
  lockedUntil: true,
  lastLoginAt: true,
  roleId: true,
  role: {
    select: { id: true, name: true, description: true },
  },
  createdAt: true,
  updatedAt: true,
};

export class AdminRepository {
  // ── User Management ───────────────────────────────────────────

  async findUsers(params: QueryUsersParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }
    if (params.role) {
      where.role = { name: params.role };
    }
    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_SAFE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: USER_SAFE_SELECT,
    });
  }

  async updateUserStatus(id: string, input: UpdateUserStatusInput) {
    return prisma.user.update({
      where: { id },
      data: { status: input.status },
      select: USER_SAFE_SELECT,
    });
  }

  // ── Role Management ───────────────────────────────────────────

  async findRoles() {
    return prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findRoleById(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async createRole(input: CreateRoleInput) {
    return prisma.role.create({
      data: {
        name: input.name,
        description: input.description,
        rolePermissions: input.permissionIds?.length
          ? {
              create: input.permissionIds.map((pId) => ({ permissionId: pId })),
            }
          : undefined,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async updateRole(id: string, input: UpdateRoleInput) {
    // If permissionIds provided, clear existing mappings and recreate
    if (input.permissionIds !== undefined) {
      await prisma.rolePermission.deleteMany({
        where: { roleId: id },
      });
    }

    return prisma.role.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        rolePermissions: input.permissionIds?.length
          ? {
              create: input.permissionIds.map((pId) => ({ permissionId: pId })),
            }
          : undefined,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  // ── Audit Logs ────────────────────────────────────────────────

  async createAuditLog(data: {
    userId?: string;
    action: string;
    module: string;
    entityType: string;
    entityId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        module: data.module,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValue: data.oldValue ? JSON.parse(JSON.stringify(data.oldValue)) : undefined,
        newValue: data.newValue ? JSON.parse(JSON.stringify(data.newValue)) : undefined,
        ipAddress: data.ipAddress,
      },
    });
  }

  async findAuditLogs(params: QueryAuditLogsParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    if (params.userId) {
      where.userId = params.userId;
    }
    if (params.module) {
      where.module = params.module;
    }
    if (params.action) {
      where.action = params.action;
    }
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate);
      }
    }

    const [auditLogs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      auditLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ── System Settings ───────────────────────────────────────────

  async findSettings() {
    return prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findSettingByKey(key: string) {
    return prisma.systemSetting.findUnique({
      where: { key },
    });
  }

  async upsertSetting(key: string, input: UpdateSystemSettingInput) {
    return prisma.systemSetting.upsert({
      where: { key },
      update: {
        value: input.value,
        description: input.description,
      },
      create: {
        key,
        value: input.value,
        description: input.description,
      },
    });
  }

  // ── Reports & Dashboard ───────────────────────────────────────

  async getDashboardSummary() {
    const [totalUsers, activeBookings, openIncidents, totalEcoReports] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.incident.count({ where: { status: { in: ['REPORTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS'] } } }),
      prisma.ecoReport.count(),
    ]);

    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    return {
      summary: {
        totalUsers,
        activeBookings,
        openIncidents,
        totalEcoReports,
      },
      recentActivities: recentAuditLogs,
    };
  }

  async getAdminReport(params: QueryAdminReportsParams) {
    const startDate = params.startDate ? new Date(params.startDate) : undefined;
    const endDate = params.endDate ? new Date(params.endDate) : undefined;
    const dateFilter = startDate || endDate ? {
      createdAt: {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      },
    } : {};

    let metrics: any = {};

    switch (params.reportType) {
      case 'USERS': {
        const [total, byStatus, byRole] = await Promise.all([
          prisma.user.count({ where: dateFilter }),
          prisma.user.groupBy({ by: ['status'], _count: { status: true }, where: dateFilter }),
          prisma.user.groupBy({ by: ['roleId'], _count: { roleId: true }, where: dateFilter }),
        ]);
        metrics = { totalUsers: total, byStatus, byRole };
        break;
      }
      case 'BOOKINGS': {
        const [total, byStatus] = await Promise.all([
          prisma.booking.count({ where: dateFilter }),
          prisma.booking.groupBy({ by: ['status'], _count: { status: true }, where: dateFilter }),
        ]);
        metrics = { totalBookings: total, byStatus };
        break;
      }
      case 'REVENUE': {
        const totalRevenue = await prisma.booking.aggregate({
          _sum: { totalAmount: true },
          where: { status: 'COMPLETED', ...dateFilter },
        });
        metrics = { totalRevenueAmount: totalRevenue._sum.totalAmount || 0 };
        break;
      }
      case 'INCIDENTS': {
        const [total, byPriority, byStatus] = await Promise.all([
          prisma.incident.count({ where: dateFilter }),
          prisma.incident.groupBy({ by: ['priority'], _count: { priority: true }, where: dateFilter }),
          prisma.incident.groupBy({ by: ['status'], _count: { status: true }, where: dateFilter }),
        ]);
        metrics = { totalIncidents: total, byPriority, byStatus };
        break;
      }
      case 'ECO': {
        const [total, byStatus] = await Promise.all([
          prisma.ecoReport.count({ where: dateFilter }),
          prisma.ecoReport.groupBy({ by: ['status'], _count: { status: true }, where: dateFilter }),
        ]);
        metrics = { totalEcoReports: total, byStatus };
        break;
      }
    }

    return {
      reportType: params.reportType,
      generatedAt: new Date().toISOString(),
      metrics,
    };
  }
}
