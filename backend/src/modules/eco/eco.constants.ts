// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 5: Eco Constants
// ═══════════════════════════════════════════════════════════════

import { EcoReportStatus } from '@prisma/client';

export const ECO_ERROR_CODES = {
  ECO_REPORT_NOT_FOUND: 'ECO_REPORT_NOT_FOUND',
  ECO_CATEGORY_NOT_FOUND: 'ECO_CATEGORY_NOT_FOUND',
  ECO_ACTIVITY_NOT_FOUND: 'ECO_ACTIVITY_NOT_FOUND',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  UNAUTHORIZED_ECO_ACCESS: 'UNAUTHORIZED_ECO_ACCESS',
} as const;

/**
 * Eco Report State Machine Strict Linear Transitions:
 * SUBMITTED -> REVIEWED -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
 * Only exact next status in linear sequence is allowed.
 * All out-of-order, backward, or unapproved status transitions are rejected.
 */
export const ALLOWED_ECO_STATUS_TRANSITIONS: Record<EcoReportStatus, EcoReportStatus[]> = {
  [EcoReportStatus.SUBMITTED]: [EcoReportStatus.REVIEWED],
  [EcoReportStatus.REVIEWED]: [EcoReportStatus.ASSIGNED],
  [EcoReportStatus.ASSIGNED]: [EcoReportStatus.IN_PROGRESS],
  [EcoReportStatus.IN_PROGRESS]: [EcoReportStatus.RESOLVED],
  [EcoReportStatus.RESOLVED]: [EcoReportStatus.CLOSED],
  [EcoReportStatus.CLOSED]: [],
};

export function isValidEcoStatusTransition(
  currentStatus: EcoReportStatus,
  nextStatus: EcoReportStatus
): boolean {
  if (currentStatus === nextStatus) return true;
  const allowedNext = ALLOWED_ECO_STATUS_TRANSITIONS[currentStatus] || [];
  return allowedNext.includes(nextStatus);
}
