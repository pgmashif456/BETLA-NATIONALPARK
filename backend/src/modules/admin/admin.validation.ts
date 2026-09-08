// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 8: Admin Validation
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { UserStatus, RoleName } from '@prisma/client';

export const queryUsersSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  role: z.nativeEnum(RoleName).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  search: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BLOCKED', 'DEACTIVATED']),
  reason: z.string().trim().optional(),
});

export const createRoleSchema = z.object({
  name: z.nativeEnum(RoleName),
  description: z.string().trim().optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.nativeEnum(RoleName).optional(),
  description: z.string().trim().optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});

export const queryAuditLogsSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  userId: z.string().uuid().optional(),
  module: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateSystemSettingSchema = z.object({
  value: z.any(),
  description: z.string().trim().optional(),
});

export const queryAdminReportsSchema = z.object({
  reportType: z.enum(['USERS', 'BOOKINGS', 'REVENUE', 'INCIDENTS', 'ECO']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
