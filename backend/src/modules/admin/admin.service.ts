// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 8: Admin Service
// ═══════════════════════════════════════════════════════════════

import { AdminRepository } from './admin.repository';
import { NotFoundError } from '../../common/errors/AppError';
import {
  QueryUsersParams,
  UpdateUserStatusInput,
  CreateRoleInput,
  UpdateRoleInput,
  QueryAuditLogsParams,
  UpdateSystemSettingInput,
  QueryAdminReportsParams,
} from './admin.types';
import { ADMIN_ERROR_CODES, ADMIN_AUDIT_MODULES, ADMIN_AUDIT_ACTIONS } from './admin.constants';

export class AdminService {
  private repository: AdminRepository;

  constructor() {
    this.repository = new AdminRepository();
  }

  // ── User Management ───────────────────────────────────────────

  async getUsers(params: QueryUsersParams) {
    return this.repository.findUsers(params);
  }

  async updateUserStatus(id: string, actorUserId: string | undefined, input: UpdateUserStatusInput, ipAddress?: string) {
    const user = await this.repository.findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`, ADMIN_ERROR_CODES.USER_NOT_FOUND);
    }

    const previousStatus = user.status;
    const updatedUser = await this.repository.updateUserStatus(id, input);

    // Record Audit Log
    await this.repository.createAuditLog({
      userId: actorUserId,
      action: ADMIN_AUDIT_ACTIONS.UPDATE_USER_STATUS,
      module: ADMIN_AUDIT_MODULES.USER,
      entityType: 'User',
      entityId: id,
      oldValue: { status: previousStatus },
      newValue: { status: input.status, reason: input.reason },
      ipAddress,
    });

    return updatedUser;
  }

  // ── Role Management ───────────────────────────────────────────

  async getRoles() {
    return this.repository.findRoles();
  }

  async createRole(actorUserId: string | undefined, input: CreateRoleInput, ipAddress?: string) {
    const role = await this.repository.createRole(input);

    // Record Audit Log
    await this.repository.createAuditLog({
      userId: actorUserId,
      action: ADMIN_AUDIT_ACTIONS.CREATE_ROLE,
      module: ADMIN_AUDIT_MODULES.ROLE,
      entityType: 'Role',
      entityId: role.id,
      newValue: { name: role.name, description: role.description },
      ipAddress,
    });

    return role;
  }

  async updateRole(id: string, actorUserId: string | undefined, input: UpdateRoleInput, ipAddress?: string) {
    const existingRole = await this.repository.findRoleById(id);
    if (!existingRole) {
      throw new NotFoundError(`Role with ID ${id} not found`, ADMIN_ERROR_CODES.ROLE_NOT_FOUND);
    }

    const updatedRole = await this.repository.updateRole(id, input);

    // Record Audit Log
    await this.repository.createAuditLog({
      userId: actorUserId,
      action: ADMIN_AUDIT_ACTIONS.UPDATE_ROLE,
      module: ADMIN_AUDIT_MODULES.ROLE,
      entityType: 'Role',
      entityId: id,
      oldValue: { name: existingRole.name, description: existingRole.description },
      newValue: { name: updatedRole.name, description: updatedRole.description },
      ipAddress,
    });

    return updatedRole;
  }

  // ── Audit Logs ────────────────────────────────────────────────

  async getAuditLogs(params: QueryAuditLogsParams) {
    return this.repository.findAuditLogs(params);
  }

  // ── System Settings ───────────────────────────────────────────

  async getSettings() {
    const settings = await this.repository.findSettings();
    return { settings };
  }

  async updateSetting(key: string, actorUserId: string | undefined, input: UpdateSystemSettingInput, ipAddress?: string) {
    const existingSetting = await this.repository.findSettingByKey(key);
    const updatedSetting = await this.repository.upsertSetting(key, input);

    // Record Audit Log
    await this.repository.createAuditLog({
      userId: actorUserId,
      action: ADMIN_AUDIT_ACTIONS.UPDATE_SETTING,
      module: ADMIN_AUDIT_MODULES.SETTING,
      entityType: 'SystemSetting',
      entityId: key,
      oldValue: existingSetting ? { value: existingSetting.value } : null,
      newValue: { value: input.value, description: input.description },
      ipAddress,
    });

    return { setting: updatedSetting };
  }

  // ── Dashboard & Reports ───────────────────────────────────────

  async getDashboardSummary() {
    return this.repository.getDashboardSummary();
  }

  async getAdminReport(params: QueryAdminReportsParams) {
    return this.repository.getAdminReport(params);
  }
}
