// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 5: Eco Controller
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { EcoService } from './eco.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AuthenticatedRequest } from '../../common/types';
import {
  createEcoReportSchema,
  updateEcoReportStatusSchema,
  assignEcoReportSchema,
  createEcoActivitySchema,
  updateEcoActivitySchema,
} from './eco.validation';
import { IncidentPriority, EcoReportStatus } from '@prisma/client';

const ecoService = new EcoService();

export async function createReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createEcoReportSchema.parse(req.body);
    const userId = req.user?.id;
    const report = await ecoService.createReport(userId, validatedData);
    sendSuccess(res, report, 201);
  } catch (error) {
    next(error);
  }
}

export async function getReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const params = {
      status: req.query.status as EcoReportStatus,
      priority: req.query.priority as IncidentPriority,
      categoryId: req.query.categoryId as string,
      reportedById: req.query.reportedById as string,
      assignedToId: req.query.assignedToId as string,
    };

    const reports = await ecoService.getReports(params, userId, userRole);
    sendSuccess(res, reports);
  } catch (error) {
    next(error);
  }
}

export async function getReportById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const report = await ecoService.getReportById(id, userId, userRole);
    sendSuccess(res, report);
  } catch (error) {
    next(error);
  }
}

export async function updateReportStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const validatedData = updateEcoReportStatusSchema.parse(req.body);

    const updatedReport = await ecoService.updateReportStatus(id, userId, validatedData);
    sendSuccess(res, updatedReport);
  } catch (error) {
    next(error);
  }
}

export async function assignReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const validatedData = assignEcoReportSchema.parse(req.body);

    const updatedReport = await ecoService.assignReport(id, userId, validatedData);
    sendSuccess(res, updatedReport);
  } catch (error) {
    next(error);
  }
}

export async function getActivities(_req: Request, res: Response, next: NextFunction) {
  try {
    const activities = await ecoService.getActivities();
    sendSuccess(res, activities);
  } catch (error) {
    next(error);
  }
}

export async function createActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createEcoActivitySchema.parse(req.body);
    const activity = await ecoService.createActivity(validatedData);
    sendSuccess(res, activity, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const validatedData = updateEcoActivitySchema.parse(req.body);
    const updatedActivity = await ecoService.updateActivity(id, validatedData);
    sendSuccess(res, updatedActivity);
  } catch (error) {
    next(error);
  }
}
