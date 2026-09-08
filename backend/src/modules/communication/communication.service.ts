import { NotificationStatus, NotificationChannel, BookingStatus } from '@prisma/client';
import { CommunicationRepository } from './communication.repository';
import {
  SendNotificationPayload,
  UpdatePreferencesPayload,
  CreateReviewPayload,
  UpdateReviewPayload,
  CreateReviewResponsePayload,
  GetNotificationsFilter,
  GetReviewsFilter,
} from './communication.types';
import { MAX_NOTIFICATION_RETRIES } from './communication.constants';

export class CommunicationService {
  private repository: CommunicationRepository;

  constructor() {
    this.repository = new CommunicationRepository();
  }

  // ── Notification Service Methods ────────────────────────────
  async sendNotification(payload: SendNotificationPayload) {
    // Check user preferences
    const preferences = await this.getPreferences(payload.userId);
    const channel = payload.channel || NotificationChannel.IN_APP;

    const isChannelEnabled =
      (channel === 'IN_APP' && preferences.inAppEnabled) ||
      (channel === 'PUSH' && preferences.pushEnabled) ||
      (channel === 'EMAIL' && preferences.emailEnabled) ||
      (channel === 'SMS' && preferences.smsEnabled);

    // Create notification in PENDING state
    const notification = await this.repository.createNotification(payload);

    if (!isChannelEnabled) {
      // Channel disabled by user preference
      return this.repository.updateNotificationDelivery(
        notification.id,
        NotificationStatus.FAILED
      );
    }

    // Attempt mock delivery with up to MAX_NOTIFICATION_RETRIES (3) attempts
    let delivered = false;
    let attempts = 0;

    while (!delivered && attempts < MAX_NOTIFICATION_RETRIES) {
      attempts++;
      // Mock delivery simulation (always succeeds in development mock provider)
      delivered = true;
    }

    if (delivered) {
      return this.repository.updateNotificationDelivery(
        notification.id,
        NotificationStatus.SENT,
        new Date()
      );
    } else {
      return this.repository.updateNotificationDelivery(
        notification.id,
        NotificationStatus.FAILED
      );
    }
  }

  async getUserNotifications(userId: string, filter: GetNotificationsFilter) {
    return this.repository.findNotificationsByUser(userId, filter);
  }

  async markNotificationAsRead(userId: string, notificationId: string) {
    const notification = await this.repository.findNotificationById(notificationId);
    if (!notification) {
      throw { statusCode: 404, code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found' };
    }
    if (notification.userId !== userId) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You cannot modify another user notification' };
    }
    return this.repository.markAsRead(notificationId);
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.repository.markAllAsRead(userId);
  }

  // ── Preference Service Methods ──────────────────────────────
  async getPreferences(userId: string) {
    let preferences = await this.repository.findPreferencesByUserId(userId);
    if (!preferences) {
      preferences = await this.repository.createDefaultPreferences(userId);
    }
    return preferences;
  }

  async updatePreferences(userId: string, payload: UpdatePreferencesPayload) {
    return this.repository.updatePreferences(userId, payload);
  }

  // ── Review Service Methods ──────────────────────────────────
  async createReview(userId: string, payload: CreateReviewPayload) {
    // 1. Verify booking existence
    const booking = await this.repository.findBookingById(payload.bookingId);
    if (!booking) {
      throw { statusCode: 404, code: 'BOOKING_NOT_FOUND', message: 'Booking not found' };
    }

    // 2. Verify booking ownership
    if (booking.userId !== userId) {
      throw {
        statusCode: 403,
        code: 'FORBIDDEN',
        message: 'You can only review experiences for your own bookings',
      };
    }

    // 3. Verify booking status is COMPLETED
    if (booking.status !== BookingStatus.COMPLETED) {
      throw {
        statusCode: 400,
        code: 'BOOKING_NOT_COMPLETED',
        message: 'Reviews are only allowed for COMPLETED bookings',
      };
    }

    // 4. Verify target exists within booking items
    const matchingItem = booking.items.find(
      (item) => item.itemType === payload.targetType && item.itemId === payload.targetId
    );
    if (!matchingItem) {
      throw {
        statusCode: 400,
        code: 'TARGET_NOT_IN_BOOKING',
        message: 'The target item does not exist in this booking',
      };
    }

    // 5. Verify no existing review for user + booking + targetType + targetId
    const existingReview = await this.repository.findReviewByUserBookingTarget(
      userId,
      payload.bookingId,
      payload.targetType,
      payload.targetId
    );
    if (existingReview) {
      throw {
        statusCode: 409,
        code: 'DUPLICATE_REVIEW',
        message: 'You have already submitted a review for this booking target',
      };
    }

    // Create immediately PUBLISHED review
    return this.repository.createReview(userId, payload);
  }

  async getPublicReviews(filter: GetReviewsFilter) {
    return this.repository.findReviews(filter);
  }

  async getUserReviews(userId: string) {
    return this.repository.findReviewsByUserId(userId);
  }

  async updateReview(userId: string, reviewId: string, payload: UpdateReviewPayload) {
    const review = await this.repository.findReviewById(reviewId);
    if (!review) {
      throw { statusCode: 404, code: 'REVIEW_NOT_FOUND', message: 'Review not found' };
    }
    if (review.userId !== userId) {
      throw {
        statusCode: 403,
        code: 'FORBIDDEN',
        message: 'You cannot edit another user review',
      };
    }
    return this.repository.updateReview(reviewId, payload);
  }

  async deleteReview(userId: string, reviewId: string) {
    const review = await this.repository.findReviewById(reviewId);
    if (!review) {
      throw { statusCode: 404, code: 'REVIEW_NOT_FOUND', message: 'Review not found' };
    }
    if (review.userId !== userId) {
      throw {
        statusCode: 403,
        code: 'FORBIDDEN',
        message: 'You cannot delete another user review',
      };
    }
    return this.repository.deleteReview(reviewId);
  }

  // ── Review Response Service Methods ─────────────────────────
  async createReviewResponse(
    responderId: string,
    reviewId: string,
    payload: CreateReviewResponsePayload
  ) {
    const review = await this.repository.findReviewById(reviewId);
    if (!review) {
      throw { statusCode: 404, code: 'REVIEW_NOT_FOUND', message: 'Review not found' };
    }

    const existingResponse = await this.repository.findResponseByReviewId(reviewId);
    if (existingResponse) {
      throw {
        statusCode: 409,
        code: 'RESPONSE_ALREADY_EXISTS',
        message: 'A response has already been submitted for this review',
      };
    }

    return this.repository.createReviewResponse(reviewId, responderId, payload);
  }
}
