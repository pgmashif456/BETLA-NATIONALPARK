import { IncidentStatus, IncidentPriority } from '@prisma/client';
import {
  ALLOWED_STATUS_TRANSITIONS,
  isValidStatusTransition,
  SAFETY_ERROR_CODES,
} from '../../src/modules/safety/safety.constants';

describe('Safety Module Unit Tests', () => {
  describe('Incident State Machine Transitions', () => {
    test('allows valid linear state transitions', () => {
      expect(isValidStatusTransition(IncidentStatus.REPORTED, IncidentStatus.ACKNOWLEDGED)).toBe(true);
      expect(isValidStatusTransition(IncidentStatus.ACKNOWLEDGED, IncidentStatus.ASSIGNED)).toBe(true);
      expect(isValidStatusTransition(IncidentStatus.ASSIGNED, IncidentStatus.IN_PROGRESS)).toBe(true);
      expect(isValidStatusTransition(IncidentStatus.IN_PROGRESS, IncidentStatus.RESOLVED)).toBe(true);
      expect(isValidStatusTransition(IncidentStatus.RESOLVED, IncidentStatus.CLOSED)).toBe(true);
    });

    test('allows exceptional transition REPORTED -> CANCELLED', () => {
      expect(isValidStatusTransition(IncidentStatus.REPORTED, IncidentStatus.CANCELLED)).toBe(true);
    });

    test('rejects invalid CANCELLED transitions from non-REPORTED states', () => {
      expect(isValidStatusTransition(IncidentStatus.ACKNOWLEDGED, IncidentStatus.CANCELLED)).toBe(false);
      expect(isValidStatusTransition(IncidentStatus.ASSIGNED, IncidentStatus.CANCELLED)).toBe(false);
      expect(isValidStatusTransition(IncidentStatus.IN_PROGRESS, IncidentStatus.CANCELLED)).toBe(false);
      expect(isValidStatusTransition(IncidentStatus.RESOLVED, IncidentStatus.CANCELLED)).toBe(false);
    });

    test('rejects backward and arbitrary status transitions', () => {
      expect(isValidStatusTransition(IncidentStatus.IN_PROGRESS, IncidentStatus.REPORTED)).toBe(false);
      expect(isValidStatusTransition(IncidentStatus.RESOLVED, IncidentStatus.IN_PROGRESS)).toBe(false);
      expect(isValidStatusTransition(IncidentStatus.CLOSED, IncidentStatus.REPORTED)).toBe(false);
      expect(isValidStatusTransition(IncidentStatus.REPORTED, IncidentStatus.RESOLVED)).toBe(false);
    });

    test('same state transition returns true', () => {
      expect(isValidStatusTransition(IncidentStatus.REPORTED, IncidentStatus.REPORTED)).toBe(true);
      expect(isValidStatusTransition(IncidentStatus.IN_PROGRESS, IncidentStatus.IN_PROGRESS)).toBe(true);
    });
  });

  describe('Safety Error Codes', () => {
    test('defines required error code constants', () => {
      expect(SAFETY_ERROR_CODES.INCIDENT_NOT_FOUND).toBe('INCIDENT_NOT_FOUND');
      expect(SAFETY_ERROR_CODES.INVALID_STATUS_TRANSITION).toBe('INVALID_STATUS_TRANSITION');
      expect(SAFETY_ERROR_CODES.UNAUTHORIZED_INCIDENT_ACCESS).toBe('UNAUTHORIZED_INCIDENT_ACCESS');
    });
  });
});
