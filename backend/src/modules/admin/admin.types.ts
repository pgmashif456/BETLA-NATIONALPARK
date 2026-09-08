// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 8: Admin Types
// ═══════════════════════════════════════════════════════════════

import { UserStatus, RoleName } from '@prisma/client';

export interface QueryUsersParams {
  page?: number;
  limit?: number;
  role?: RoleName;
  status?: UserStatus;
  search?: string;
}

export interface UpdateUserStatusInput {
  status: UserStatus;
  reason?: string;
}

export interface CreateRoleInput {
  name: RoleName;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleInput {
  name?: RoleName;
  description?: string;
  permissionIds?: string[];
}

export interface QueryAuditLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  module?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateSystemSettingInput {
  value?: any;
  description?: string;
}

export interface QueryAdminReportsParams {
  reportType: 'USERS' | 'BOOKINGS' | 'REVENUE' | 'INCIDENTS' | 'ECO';
  startDate?: string;
  endDate?: string;
}
