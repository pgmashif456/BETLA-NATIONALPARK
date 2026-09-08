// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 5: Eco Repository
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../../database/client';
import { IncidentPriority, EcoReportStatus, Prisma } from '@prisma/client';
import {
  CreateEcoActivityInput,
  UpdateEcoActivityInput,
  QueryEcoReportParams,
} from './eco.types';

export class EcoRepository {
  // ── Eco Reports ───────────────────────────────────────────────

  async createReport(data: {
    reportedById?: string;
    categoryId?: string;
    description: string;
    location?: string;
    priority?: IncidentPriority;
    status?: EcoReportStatus;
  }) {
    return prisma.ecoReport.create({
      data: {
        reportedById: data.reportedById,
        categoryId: data.categoryId,
        description: data.description,
        location: data.location,
        priority: data.priority || IncidentPriority.MEDIUM,
        status: data.status || EcoReportStatus.SUBMITTED,
      },
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        category: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        updates: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async findReportById(id: string) {
    return prisma.ecoReport.findUnique({
      where: { id },
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        category: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        updates: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async findReports(params: QueryEcoReportParams) {
    const where: Prisma.EcoReportWhereInput = {};

    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.reportedById) where.reportedById = params.reportedById;
    if (params.assignedToId) where.assignedToId = params.assignedToId;

    return prisma.ecoReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        category: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async updateReport(
    id: string,
    data: {
      status?: EcoReportStatus;
      assignedToId?: string;
      resolvedAt?: Date | null;
    }
  ) {
    return prisma.ecoReport.update({
      where: { id },
      data,
      include: {
        reportedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        category: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        updates: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async createReportUpdate(data: {
    ecoReportId: string;
    userId?: string;
    notes: string;
    previousStatus?: EcoReportStatus;
    newStatus?: EcoReportStatus;
  }) {
    return prisma.ecoUpdate.create({
      data: {
        ecoReportId: data.ecoReportId,
        userId: data.userId,
        notes: data.notes,
        previousStatus: data.previousStatus,
        newStatus: data.newStatus,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  // ── Eco Activities ────────────────────────────────────────────

  async findActivities() {
    return prisma.ecoActivity.findMany({
      orderBy: { activityDate: 'asc' },
    });
  }

  async findActivityById(id: string) {
    return prisma.ecoActivity.findUnique({
      where: { id },
    });
  }

  async createActivity(data: CreateEcoActivityInput) {
    return prisma.ecoActivity.create({
      data: {
        title: data.title,
        description: data.description,
        activityDate: data.activityDate,
        location: data.location,
        organizer: data.organizer,
        status: data.status || 'ACTIVE',
      },
    });
  }

  async updateActivity(id: string, data: UpdateEcoActivityInput) {
    return prisma.ecoActivity.update({
      where: { id },
      data,
    });
  }
}
