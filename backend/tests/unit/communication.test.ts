import {
  createReviewSchema,
  updatePreferencesSchema,
  createReviewResponseSchema,
} from '../../src/modules/communication/communication.validation';
import {
  NOTIFICATION_STATUSES,
  NOTIFICATION_CHANNELS,
  REVIEW_TARGET_TYPES,
  MAX_NOTIFICATION_RETRIES,
} from '../../src/modules/communication/communication.constants';

describe('Module 6 Unit Tests: Communication, Notifications & Reviews', () => {
  describe('Constants & Enum Specifications', () => {
    it('defines delivery statuses PENDING, SENT, FAILED and no READ status in delivery status enum', () => {
      expect(NOTIFICATION_STATUSES.PENDING).toBe('PENDING');
      expect(NOTIFICATION_STATUSES.SENT).toBe('SENT');
      expect(NOTIFICATION_STATUSES.FAILED).toBe('FAILED');
      expect((NOTIFICATION_STATUSES as any).READ).toBeUndefined();
      expect((NOTIFICATION_STATUSES as any).UNREAD).toBeUndefined();
    });

    it('defines allowed channels IN_APP, PUSH, EMAIL, SMS', () => {
      expect(NOTIFICATION_CHANNELS.IN_APP).toBe('IN_APP');
      expect(NOTIFICATION_CHANNELS.PUSH).toBe('PUSH');
      expect(NOTIFICATION_CHANNELS.EMAIL).toBe('EMAIL');
      expect(NOTIFICATION_CHANNELS.SMS).toBe('SMS');
    });

    it('defines review target types GUIDE_SERVICE and HOMESTAY_PROPERTY', () => {
      expect(REVIEW_TARGET_TYPES.GUIDE_SERVICE).toBe('GUIDE_SERVICE');
      expect(REVIEW_TARGET_TYPES.HOMESTAY_PROPERTY).toBe('HOMESTAY_PROPERTY');
    });

    it('defines max retry count of 3 for failed dispatches', () => {
      expect(MAX_NOTIFICATION_RETRIES).toBe(3);
    });
  });

  describe('Validation Schemas', () => {
    it('validates a correct createReview payload', () => {
      const payload = {
        bookingId: '123e4567-e89b-12d3-a456-426614174000',
        targetType: 'GUIDE_SERVICE',
        targetId: '123e4567-e89b-12d3-a456-426614174001',
        rating: 5,
        title: 'Great Experience',
        comment: 'The guide was extremely knowledgeable and friendly.',
      };
      const result = createReviewSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects rating greater than 5', () => {
      const payload = {
        bookingId: '123e4567-e89b-12d3-a456-426614174000',
        targetType: 'GUIDE_SERVICE',
        targetId: '123e4567-e89b-12d3-a456-426614174001',
        rating: 6,
        comment: 'Awesome service',
      };
      const result = createReviewSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects rating less than 1', () => {
      const payload = {
        bookingId: '123e4567-e89b-12d3-a456-426614174000',
        targetType: 'GUIDE_SERVICE',
        targetId: '123e4567-e89b-12d3-a456-426614174001',
        rating: 0,
        comment: 'Terrible experience',
      };
      const result = createReviewSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects invalid targetType', () => {
      const payload = {
        bookingId: '123e4567-e89b-12d3-a456-426614174000',
        targetType: 'INVALID_TARGET',
        targetId: '123e4567-e89b-12d3-a456-426614174001',
        rating: 4,
        comment: 'Good stay',
      };
      const result = createReviewSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('validates updatePreferences payload with boolean channel flags', () => {
      const payload = {
        inAppEnabled: true,
        emailEnabled: false,
      };
      const result = updatePreferencesSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('validates createReviewResponse payload', () => {
      const payload = {
        responseText: 'Thank you for your review!',
      };
      const result = createReviewResponseSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});
