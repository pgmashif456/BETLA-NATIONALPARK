// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 4: Safety Constants
// ═══════════════════════════════════════════════════════════════

import { IncidentStatus } from '@prisma/client';

export const SAFETY_ERROR_CODES = {
  INCIDENT_NOT_FOUND: 'INCIDENT_NOT_FOUND',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  UNAUTHORIZED_INCIDENT_ACCESS: 'UNAUTHORIZED_INCIDENT_ACCESS',
  ALERT_NOT_FOUND: 'ALERT_NOT_FOUND',
  EMERGENCY_CONTACT_NOT_FOUND: 'EMERGENCY_CONTACT_NOT_FOUND',
} as const;

/**
 * Incident State Machine Allowed Transitions
 * REPORTED -> ACKNOWLEDGED, ASSIGNED, CANCELLED
 * ACKNOWLEDGED -> ASSIGNED
 * ASSIGNED -> IN_PROGRESS
 * IN_PROGRESS -> RESOLVED
 * RESOLVED -> CLOSED
 * Exceptional transition: REPORTED -> CANCELLED (only from REPORTED)
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  [IncidentStatus.REPORTED]: [IncidentStatus.ACKNOWLEDGED, IncidentStatus.ASSIGNED, IncidentStatus.CANCELLED],
  [IncidentStatus.ACKNOWLEDGED]: [IncidentStatus.ASSIGNED],
  [IncidentStatus.ASSIGNED]: [IncidentStatus.IN_PROGRESS],
  [IncidentStatus.IN_PROGRESS]: [IncidentStatus.RESOLVED],
  [IncidentStatus.RESOLVED]: [IncidentStatus.CLOSED],
  [IncidentStatus.CLOSED]: [],
  [IncidentStatus.CANCELLED]: [],
};

export function isValidStatusTransition(
  currentStatus: IncidentStatus,
  nextStatus: IncidentStatus
): boolean {
  if (currentStatus === nextStatus) return true;
  const allowedNext = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  return allowedNext.includes(nextStatus);
}

