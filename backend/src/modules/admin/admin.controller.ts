// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 8: Admin Controller
// ═══════════════════════════════════════════════════════════════

import { Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AuthenticatedRequest } from '../../common/types';
import {
  queryUsersSchema,
  updateUserStatusSchema,
  createRoleSchema,
  updateRoleSchema,
  queryAuditLogsSchema,
  updateSystemSettingSchema,
  queryAdminReportsSchema,
} from './admin.validation';

const adminService = new AdminService();

export async function getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const params = queryUsersSchema.parse(req.query);
    const result = await adminService.getUsers(params);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const actorUserId = req.user?.id;
    const validatedData = updateUserStatusSchema.parse(req.body);
    const ipAddress = req.ip;

    const user = await adminService.updateUserStatus(id, actorUserId, validatedData, ipAddress);
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}

export async function getRoles(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const roles = await adminService.getRoles();
    sendSuccess(res, { roles });
  } catch (error) {
    next(error);
  }
}

export async function createRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const actorUserId = req.user?.id;
    const validatedData = createRoleSchema.parse(req.body);
    const ipAddress = req.ip;

    const role = await adminService.createRole(actorUserId, validatedData, ipAddress);
    sendSuccess(res, { role }, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const actorUserId = req.user?.id;
    const validatedData = updateRoleSchema.parse(req.body);
    const ipAddress = req.ip;

    const role = await adminService.updateRole(id, actorUserId, validatedData, ipAddress);
    sendSuccess(res, { role });
  } catch (error) {
    next(error);
  }
}

export async function getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const params = queryAuditLogsSchema.parse(req.query);
    const result = await adminService.getAuditLogs(params);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getSettings(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getSettings();
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function updateSetting(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const key = req.params.key as string;
    const actorUserId = req.user?.id;
    const validatedData = updateSystemSettingSchema.parse(req.body);
    const ipAddress = req.ip;

    const result = await adminService.updateSetting(key, actorUserId, validatedData, ipAddress);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getDashboardSummary();
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const params = queryAdminReportsSchema.parse(req.query);
    const result = await adminService.getAdminReport(params);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
