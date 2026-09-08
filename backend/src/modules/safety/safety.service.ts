// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 4: Safety Service
// ═══════════════════════════════════════════════════════════════

import { IncidentPriority, IncidentStatus } from '@prisma/client';
import { SafetyRepository } from './safety.repository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../common/errors/AppError';
import {
  CreateEmergencyInput,
  CreateIncidentInput,
  UpdateIncidentStatusInput,
  AssignIncidentInput,
  AddIncidentUpdateInput,
  CreateSafetyAlertInput,
  QueryIncidentParams,
} from './safety.types';
import { SAFETY_ERROR_CODES, isValidStatusTransition } from './safety.constants';
import { prisma } from '../../database/client';

export class SafetyService {
  private repository: SafetyRepository;

  constructor() {
    this.repository = new SafetyRepository();
  }

  // ── Emergency Request Flow ─────────────────────────────────────

  async createEmergency(userId: string | undefined, input: CreateEmergencyInput) {
    const emergencyIncident = await this.repository.createIncident({
      reportedById: userId,
      type: input.type || 'SOS Emergency',
      description: input.description || 'CRITICAL SOS Emergency signal triggered by user',
      location: input.location || 'Betla Reserve Territory',
      latitude: input.latitude,
      longitude: input.longitude,
      priority: IncidentPriority.CRITICAL,
      status: IncidentStatus.REPORTED,
    });

    // Create initial update log
    await this.repository.createIncidentUpdate({
      incidentId: emergencyIncident.id,
      userId,
      notes: 'Emergency SOS action triggered. Priority set to CRITICAL.',
      newStatus: IncidentStatus.REPORTED,
    });

    return emergencyIncident;
  }

  // ── Incidents Management ──────────────────────────────────────

  async createIncident(userId: string | undefined, input: CreateIncidentInput) {
    const incident = await this.repository.createIncident({
      reportedById: userId,
      type: input.type,
      description: input.description,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      priority: input.priority || IncidentPriority.MEDIUM,
      status: IncidentStatus.REPORTED,
    });

    await this.repository.createIncidentUpdate({
      incidentId: incident.id,
      userId,
      notes: `Incident reported with priority ${incident.priority}.`,
      newStatus: IncidentStatus.REPORTED,
    });

    return incident;
  }

  async getIncidentById(id: string, userId?: string, userRole?: string) {
    const incident = await this.repository.findIncidentById(id);
    if (!incident) {
      throw new NotFoundError(
        `Incident with ID ${id} not found`,
        SAFETY_ERROR_CODES.INCIDENT_NOT_FOUND
      );
    }

    // Access control check
    const isMgmt = userRole === 'ADMIN' || userRole === 'FOREST_AUTHORITY';
    const isReporter = userId && incident.reportedById === userId;
    const isAssignee = userId && incident.assignedToId === userId;

    if (!isMgmt && !isReporter && !isAssignee) {
      throw new ForbiddenError(
        'You are not authorized to view this restricted incident',
        SAFETY_ERROR_CODES.UNAUTHORIZED_INCIDENT_ACCESS
      );
    }

    return incident;
  }

  async getIncidents(params: QueryIncidentParams, userId?: string, userRole?: string) {
    const queryParams: QueryIncidentParams = { ...params };
    const isMgmt = userRole === 'ADMIN' || userRole === 'FOREST_AUTHORITY';

    // If not management staff, filter incidents reported by or assigned to current user
    if (!isMgmt && userId) {
      queryParams.reportedById = userId;
    }

    return this.repository.findIncidents(queryParams);
  }

  async updateIncidentStatus(id: string, userId: string | undefined, input: UpdateIncidentStatusInput) {
    const incident = await this.repository.findIncidentById(id);
    if (!incident) {
      throw new NotFoundError(
        `Incident with ID ${id} not found`,
        SAFETY_ERROR_CODES.INCIDENT_NOT_FOUND
      );
    }

    // Validate state machine transition
    if (!isValidStatusTransition(incident.status, input.status)) {
      throw new BadRequestError(
        `Cannot transition incident status from ${incident.status} to ${input.status}`,
        SAFETY_ERROR_CODES.INVALID_STATUS_TRANSITION
      );
    }

    const resolvedAt = input.status === IncidentStatus.RESOLVED ? new Date() : incident.resolvedAt;

    const updatedIncident = await this.repository.updateIncident(id, {
      status: input.status,
      resolvedAt,
    });

    // Record state change update log
    await this.repository.createIncidentUpdate({
      incidentId: id,
      userId,
      notes: input.notes || `Incident status updated to ${input.status}.`,
      previousStatus: incident.status,
      newStatus: input.status,
    });

    return updatedIncident;
  }

  async assignIncident(id: string, userId: string | undefined, input: AssignIncidentInput) {
    const incident = await this.repository.findIncidentById(id);
    if (!incident) {
      throw new NotFoundError(
        `Incident with ID ${id} not found`,
        SAFETY_ERROR_CODES.INCIDENT_NOT_FOUND
      );
    }

    // Verify assigned user exists
    const assignee = await prisma.user.findUnique({ where: { id: input.assignedToId } });
    if (!assignee) {
      throw new NotFoundError(`Assignee user with ID ${input.assignedToId} not found`);
    }

    // Determine target status (if REPORTED/ACKNOWLEDGED, move to ASSIGNED)
    let nextStatus = incident.status;
    if (incident.status === IncidentStatus.REPORTED || incident.status === IncidentStatus.ACKNOWLEDGED) {
      nextStatus = IncidentStatus.ASSIGNED;
    }

    const updatedIncident = await this.repository.updateIncident(id, {
      assignedToId: input.assignedToId,
      status: nextStatus,
    });

    await this.repository.createIncidentUpdate({
      incidentId: id,
      userId,
      notes: input.notes || `Incident assigned to ${assignee.firstName} ${assignee.lastName}.`,
      previousStatus: incident.status,
      newStatus: nextStatus,
    });

    return updatedIncident;
  }

  async addIncidentUpdate(id: string, userId: string | undefined, input: AddIncidentUpdateInput) {
    const incident = await this.repository.findIncidentById(id);
    if (!incident) {
      throw new NotFoundError(
        `Incident with ID ${id} not found`,
        SAFETY_ERROR_CODES.INCIDENT_NOT_FOUND
      );
    }

    const updateLog = await this.repository.createIncidentUpdate({
      incidentId: id,
      userId,
      notes: input.notes,
      previousStatus: incident.status,
      newStatus: incident.status,
    });

    return updateLog;
  }

  // ── Safety Alerts ─────────────────────────────────────────────

  async createSafetyAlert(userId: string | undefined, input: CreateSafetyAlertInput) {
    return this.repository.createSafetyAlert({
      ...input,
      issuedById: userId,
    });
  }

  async getSafetyAlerts() {
    return this.repository.findActiveSafetyAlerts();
  }
}
