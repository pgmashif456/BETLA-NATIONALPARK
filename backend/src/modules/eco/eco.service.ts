// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 5: Eco Service
// ═══════════════════════════════════════════════════════════════

import { EcoReportStatus, IncidentPriority } from '@prisma/client';
import { EcoRepository } from './eco.repository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../common/errors/AppError';
import {
  CreateEcoReportInput,
  UpdateEcoReportStatusInput,
  AssignEcoReportInput,
  CreateEcoActivityInput,
  UpdateEcoActivityInput,
  QueryEcoReportParams,
} from './eco.types';
import { ECO_ERROR_CODES, isValidEcoStatusTransition } from './eco.constants';
import { prisma } from '../../database/client';

export class EcoService {
  private repository: EcoRepository;

  constructor() {
    this.repository = new EcoRepository();
  }

  // ── Eco Reports Management ────────────────────────────────────

  async createReport(userId: string | undefined, input: CreateEcoReportInput) {
    // Verify category if categoryId provided
    if (input.categoryId) {
      const category = await prisma.ecoCategory.findUnique({ where: { id: input.categoryId } });
      if (!category) {
        throw new NotFoundError(
          `Eco category with ID ${input.categoryId} not found`,
          ECO_ERROR_CODES.ECO_CATEGORY_NOT_FOUND
        );
      }
    }

    const report = await this.repository.createReport({
      reportedById: userId,
      categoryId: input.categoryId,
      description: input.description,
      location: input.location,
      priority: input.priority || IncidentPriority.MEDIUM,
      status: EcoReportStatus.SUBMITTED,
    });

    // Record initial update history log
    await this.repository.createReportUpdate({
      ecoReportId: report.id,
      userId,
      notes: `Environmental report submitted with priority ${report.priority}.`,
      newStatus: EcoReportStatus.SUBMITTED,
    });

    return report;
  }

  async getReportById(id: string, userId?: string, userRole?: string) {
    const report = await this.repository.findReportById(id);
    if (!report) {
      throw new NotFoundError(
        `Eco report with ID ${id} not found`,
        ECO_ERROR_CODES.ECO_REPORT_NOT_FOUND
      );
    }

    // Access control: Admin/Forest Authority, Reporter, Assignee
    const isMgmt = userRole === 'ADMIN' || userRole === 'FOREST_AUTHORITY';
    const isReporter = userId && report.reportedById === userId;
    const isAssignee = userId && report.assignedToId === userId;

    if (!isMgmt && !isReporter && !isAssignee) {
      throw new ForbiddenError(
        'You are not authorized to access this restricted environmental report',
        ECO_ERROR_CODES.UNAUTHORIZED_ECO_ACCESS
      );
    }

    return report;
  }

  async getReports(params: QueryEcoReportParams, userId?: string, userRole?: string) {
    const queryParams: QueryEcoReportParams = { ...params };
    const isMgmt = userRole === 'ADMIN' || userRole === 'FOREST_AUTHORITY';

    // If non-management user (Tourist/Guide/Homestay), restrict to reports submitted by user
    if (!isMgmt && userId) {
      queryParams.reportedById = userId;
    }

    return this.repository.findReports(queryParams);
  }

  async updateReportStatus(id: string, userId: string | undefined, input: UpdateEcoReportStatusInput) {
    const report = await this.repository.findReportById(id);
    if (!report) {
      throw new NotFoundError(
        `Eco report with ID ${id} not found`,
        ECO_ERROR_CODES.ECO_REPORT_NOT_FOUND
      );
    }

    // Validate strict linear state machine transition
    if (!isValidEcoStatusTransition(report.status, input.status)) {
      throw new BadRequestError(
        `Cannot transition eco report status from ${report.status} to ${input.status}`,
        ECO_ERROR_CODES.INVALID_STATUS_TRANSITION
      );
    }

    const resolvedAt = input.status === EcoReportStatus.RESOLVED ? new Date() : report.resolvedAt;

    const updatedReport = await this.repository.updateReport(id, {
      status: input.status,
      resolvedAt,
    });

    // Record state change history log
    await this.repository.createReportUpdate({
      ecoReportId: id,
      userId,
      notes: input.notes || `Report status updated to ${input.status}.`,
      previousStatus: report.status,
      newStatus: input.status,
    });

    return updatedReport;
  }

  async assignReport(id: string, userId: string | undefined, input: AssignEcoReportInput) {
    const report = await this.repository.findReportById(id);
    if (!report) {
      throw new NotFoundError(
        `Eco report with ID ${id} not found`,
        ECO_ERROR_CODES.ECO_REPORT_NOT_FOUND
      );
    }

    // Verify target assignee user exists
    const assignee = await prisma.user.findUnique({ where: { id: input.assignedToId } });
    if (!assignee) {
      throw new NotFoundError(`Assignee user with ID ${input.assignedToId} not found`);
    }

    // Assigning moves SUBMITTED or REVIEWED status to ASSIGNED
    let nextStatus = report.status;
    if (report.status === EcoReportStatus.SUBMITTED || report.status === EcoReportStatus.REVIEWED) {
      nextStatus = EcoReportStatus.ASSIGNED;
    }

    const updatedReport = await this.repository.updateReport(id, {
      assignedToId: input.assignedToId,
      status: nextStatus,
    });

    await this.repository.createReportUpdate({
      ecoReportId: id,
      userId,
      notes: input.notes || `Report assigned to ${assignee.firstName} ${assignee.lastName}.`,
      previousStatus: report.status,
      newStatus: nextStatus,
    });

    return updatedReport;
  }

  // ── Eco Activities Management ─────────────────────────────────

  async getActivities() {
    return this.repository.findActivities();
  }

  async createActivity(input: CreateEcoActivityInput) {
    return this.repository.createActivity(input);
  }

  async updateActivity(id: string, input: UpdateEcoActivityInput) {
    const activity = await this.repository.findActivityById(id);
    if (!activity) {
      throw new NotFoundError(
        `Eco activity with ID ${id} not found`,
        ECO_ERROR_CODES.ECO_ACTIVITY_NOT_FOUND
      );
    }

    return this.repository.updateActivity(id, input);
  }
}
