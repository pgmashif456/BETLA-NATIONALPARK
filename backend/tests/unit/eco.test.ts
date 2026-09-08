import { EcoReportStatus } from '@prisma/client';
import {
  ALLOWED_ECO_STATUS_TRANSITIONS,
  isValidEcoStatusTransition,
  ECO_ERROR_CODES,
} from '../../src/modules/eco/eco.constants';
import {
  createEcoReportSchema,
  updateEcoReportStatusSchema,
  assignEcoReportSchema,
  createEcoActivitySchema,
  updateEcoActivitySchema,
} from '../../src/modules/eco/eco.validation';

describe('Module 5: Eco Unit Tests', () => {
  describe('Eco Report Linear State Machine', () => {
    test('allows strict linear status transitions', () => {
      expect(isValidEcoStatusTransition(EcoReportStatus.SUBMITTED, EcoReportStatus.REVIEWED)).toBe(true);
      expect(isValidEcoStatusTransition(EcoReportStatus.REVIEWED, EcoReportStatus.ASSIGNED)).toBe(true);
      expect(isValidEcoStatusTransition(EcoReportStatus.ASSIGNED, EcoReportStatus.IN_PROGRESS)).toBe(true);
      expect(isValidEcoStatusTransition(EcoReportStatus.IN_PROGRESS, EcoReportStatus.RESOLVED)).toBe(true);
      expect(isValidEcoStatusTransition(EcoReportStatus.RESOLVED, EcoReportStatus.CLOSED)).toBe(true);
    });

    test('rejects skipped or out-of-order transitions', () => {
      expect(isValidEcoStatusTransition(EcoReportStatus.SUBMITTED, EcoReportStatus.ASSIGNED)).toBe(false);
      expect(isValidEcoStatusTransition(EcoReportStatus.SUBMITTED, EcoReportStatus.IN_PROGRESS)).toBe(false);
      expect(isValidEcoStatusTransition(EcoReportStatus.SUBMITTED, EcoReportStatus.CLOSED)).toBe(false);
      expect(isValidEcoStatusTransition(EcoReportStatus.REVIEWED, EcoReportStatus.RESOLVED)).toBe(false);
      expect(isValidEcoStatusTransition(EcoReportStatus.RESOLVED, EcoReportStatus.ASSIGNED)).toBe(false);
    });

    test('rejects backward transitions', () => {
      expect(isValidEcoStatusTransition(EcoReportStatus.CLOSED, EcoReportStatus.IN_PROGRESS)).toBe(false);
      expect(isValidEcoStatusTransition(EcoReportStatus.IN_PROGRESS, EcoReportStatus.SUBMITTED)).toBe(false);
    });

    test('allows same state transition', () => {
      expect(isValidEcoStatusTransition(EcoReportStatus.SUBMITTED, EcoReportStatus.SUBMITTED)).toBe(true);
      expect(isValidEcoStatusTransition(EcoReportStatus.IN_PROGRESS, EcoReportStatus.IN_PROGRESS)).toBe(true);
    });
  });

  describe('Validation Schemas', () => {
    test('validates correct createEcoReport payload', () => {
      const payload = {
        description: 'Illegal tree cutting observed in North Sector',
        location: 'North Sector Gate 2',
        priority: 'HIGH',
      };
      const parsed = createEcoReportSchema.parse(payload);
      expect(parsed.description).toBe(payload.description);
    });

    test('rejects short description in createEcoReport', () => {
      expect(() => createEcoReportSchema.parse({ description: 'Tree' })).toThrow();
    });

    test('validates updateEcoReportStatus payload', () => {
      const payload = { status: 'REVIEWED', notes: 'Reviewed by Forest Officer' };
      const parsed = updateEcoReportStatusSchema.parse(payload);
      expect(parsed.status).toBe('REVIEWED');
    });

    test('validates createEcoActivity payload', () => {
      const payload = {
        title: 'Betla Plantation Drive 2026',
        description: 'Annual tree plantation event',
        activityDate: '2026-10-15T09:00:00.000Z',
        location: 'Betla Range Office',
        organizer: 'Forest Department',
      };
      const parsed = createEcoActivitySchema.parse(payload);
      expect(parsed.title).toBe(payload.title);
      expect(parsed.activityDate).toBeInstanceOf(Date);
    });
  });

  describe('Eco Error Codes', () => {
    test('defines required error code constants', () => {
      expect(ECO_ERROR_CODES.ECO_REPORT_NOT_FOUND).toBe('ECO_REPORT_NOT_FOUND');
      expect(ECO_ERROR_CODES.INVALID_STATUS_TRANSITION).toBe('INVALID_STATUS_TRANSITION');
      expect(ECO_ERROR_CODES.UNAUTHORIZED_ECO_ACCESS).toBe('UNAUTHORIZED_ECO_ACCESS');
    });
  });
});
