// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 4: Safety Types
// ═══════════════════════════════════════════════════════════════

import { IncidentStatus, IncidentPriority, AlertSeverity } from '@prisma/client';

export interface CreateEmergencyInput {
  type?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateIncidentInput {
  type: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  priority?: IncidentPriority;
}

export interface UpdateIncidentStatusInput {
  status: IncidentStatus;
  notes?: string;
}

export interface AssignIncidentInput {
  assignedToId: string;
  notes?: string;
}

export interface AddIncidentUpdateInput {
  notes: string;
}

export interface CreateSafetyAlertInput {
  title: string;
  message: string;
  severity?: AlertSeverity;
  area?: string;
  expiresAt?: string;
}

export interface QueryIncidentParams {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  reportedById?: string;
  assignedToId?: string;
}
