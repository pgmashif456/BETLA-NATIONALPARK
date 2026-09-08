// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 4: Safety Repository
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../../database/client';
import { IncidentPriority, IncidentStatus, AlertSeverity, Prisma } from '@prisma/client';
import {
  CreateSafetyAlertInput,
  QueryIncidentParams,
} from './safety.types';

export class SafetyRepository {
  // ── Incidents ─────────────────────────────────────────────────

  async createIncident(data: {
    reportedById?: string;
    type: string;
    description: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    priority?: IncidentPriority;
    status?: IncidentStatus;
  }) {
    return prisma.incident.create({
      data: {
        reportedById: data.reportedById,
        type: data.type,
        description: data.description,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        priority: data.priority ?? IncidentPriority.MEDIUM,
        status: data.status ?? IncidentStatus.REPORTED,
      },
      include: {
        reportedBy: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        assignedTo: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        updates: true,
      },
    });
  }

  async findIncidentById(id: string) {
    return prisma.incident.findUnique({
      where: { id },
      include: {
        reportedBy: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        assignedTo: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        updates: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findIncidents(params: QueryIncidentParams) {
    const where: Prisma.IncidentWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }
    if (params.priority) {
      where.priority = params.priority;
    }
    if (params.reportedById) {
      where.reportedById = params.reportedById;
    }
    if (params.assignedToId) {
      where.assignedToId = params.assignedToId;
    }

    return prisma.incident.findMany({
      where,
      include: {
        reportedBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        assignedTo: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateIncident(
    id: string,
    data: {
      status?: IncidentStatus;
      assignedToId?: string;
      resolvedAt?: Date | null;
    }
  ) {
    return prisma.incident.update({
      where: { id },
      data,
      include: {
        reportedBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        assignedTo: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // ── Incident Updates ──────────────────────────────────────────

  async createIncidentUpdate(data: {
    incidentId: string;
    userId?: string;
    notes: string;
    previousStatus?: IncidentStatus;
    newStatus?: IncidentStatus;
  }) {
    return prisma.incidentUpdate.create({
      data,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });
  }

  // ── Safety Alerts ─────────────────────────────────────────────

  async createSafetyAlert(data: CreateSafetyAlertInput & { issuedById?: string }) {
    return prisma.safetyAlert.create({
      data: {
        title: data.title,
        message: data.message,
        severity: data.severity ?? AlertSeverity.INFO,
        area: data.area,
        issuedById: data.issuedById,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        issuedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findActiveSafetyAlerts() {
    const now = new Date();
    return prisma.safetyAlert.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
