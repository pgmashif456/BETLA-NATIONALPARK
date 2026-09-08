// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 4: Safety Controller
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { SafetyService } from './safety.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AuthenticatedRequest } from '../../common/types';
import {
  createEmergencySchema,
  createIncidentSchema,
  updateIncidentStatusSchema,
  assignIncidentSchema,
  addIncidentUpdateSchema,
  createSafetyAlertSchema,
} from './safety.validation';
import { IncidentPriority, IncidentStatus } from '@prisma/client';

const safetyService = new SafetyService();

export async function createEmergency(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createEmergencySchema.parse(req.body);
    const userId = req.user?.id;
    const emergency = await safetyService.createEmergency(userId, validatedData);
    sendSuccess(res, emergency, 201);
  } catch (error) {
    next(error);
  }
}

export async function createIncident(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createIncidentSchema.parse(req.body);
    const userId = req.user?.id;
    const incident = await safetyService.createIncident(userId, validatedData);
    sendSuccess(res, incident, 201);
  } catch (error) {
    next(error);
  }
}

export async function getIncidents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const params = {
      status: req.query.status as IncidentStatus,
      priority: req.query.priority as IncidentPriority,
      reportedById: req.query.reportedById as string,
      assignedToId: req.query.assignedToId as string,
    };

    const incidents = await safetyService.getIncidents(params, userId, userRole);
    sendSuccess(res, incidents);
  } catch (error) {
    next(error);
  }
}

export async function getIncidentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const incident = await safetyService.getIncidentById(id, userId, userRole);
    sendSuccess(res, incident);
  } catch (error) {
    next(error);
  }
}

export async function updateIncidentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const validatedData = updateIncidentStatusSchema.parse(req.body);

    const updatedIncident = await safetyService.updateIncidentStatus(id, userId, validatedData);
    sendSuccess(res, updatedIncident);
  } catch (error) {
    next(error);
  }
}

export async function assignIncident(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const validatedData = assignIncidentSchema.parse(req.body);

    const updatedIncident = await safetyService.assignIncident(id, userId, validatedData);
    sendSuccess(res, updatedIncident);
  } catch (error) {
    next(error);
  }
}

export async function addIncidentUpdate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const validatedData = addIncidentUpdateSchema.parse(req.body);

    const updateLog = await safetyService.addIncidentUpdate(id, userId, validatedData);
    sendSuccess(res, updateLog, 201);
  } catch (error) {
    next(error);
  }
}

export async function getSafetyAlerts(_req: Request, res: Response, next: NextFunction) {
  try {
    const alerts = await safetyService.getSafetyAlerts();
    sendSuccess(res, alerts);
  } catch (error) {
    next(error);
  }
}

export async function createSafetyAlert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createSafetyAlertSchema.parse(req.body);
    const userId = req.user?.id;

    const alert = await safetyService.createSafetyAlert(userId, validatedData);
    sendSuccess(res, alert, 201);
  } catch (error) {
    next(error);
  }
}
