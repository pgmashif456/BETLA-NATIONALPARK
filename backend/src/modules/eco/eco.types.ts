// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 5: Eco Types
// ═══════════════════════════════════════════════════════════════

import { IncidentPriority, EcoReportStatus } from '@prisma/client';

export interface CreateEcoReportInput {
  categoryId?: string;
  description: string;
  location?: string;
  priority?: IncidentPriority;
}

export interface UpdateEcoReportStatusInput {
  status: EcoReportStatus;
  notes?: string;
}

export interface AssignEcoReportInput {
  assignedToId: string;
  notes?: string;
}

export interface CreateEcoActivityInput {
  title: string;
  description: string;
  activityDate: Date;
  location?: string;
  organizer?: string;
  status?: string;
}

export interface UpdateEcoActivityInput {
  title?: string;
  description?: string;
  activityDate?: Date;
  location?: string;
  organizer?: string;
  status?: string;
}

export interface QueryEcoReportParams {
  status?: EcoReportStatus;
  priority?: IncidentPriority;
  categoryId?: string;
  reportedById?: string;
  assignedToId?: string;
}
