import { PrismaClient, Prisma, NotificationStatus, ReviewStatus } from '@prisma/client';
import {
  SendNotificationPayload,
  UpdatePreferencesPayload,
  CreateReviewPayload,
  UpdateReviewPayload,
  CreateReviewResponsePayload,
  GetNotificationsFilter,
  GetReviewsFilter,
} from './communication.types';

const prisma = new PrismaClient();

export class CommunicationRepository {
  // ── Notification Operations ──────────────────────────────────
  async createNotification(payload: SendNotificationPayload) {
    return prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data as Prisma.InputJsonValue | undefined,
        channel: payload.channel || 'IN_APP',
        status: NotificationStatus.PENDING,
      },
    });
  }

  async updateNotificationDelivery(
    id: string,
    status: NotificationStatus,
    sentAt?: Date
  ) {
    return prisma.notification.update({
      where: { id },
      data: {
        status,
        sentAt,
      },
    });
  }

  async findNotificationsByUser(userId: string, filter: GetNotificationsFilter) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId,
    };

    if (filter.unreadOnly) {
      where.readAt = null;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.type) {
      where.type = filter.type;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total, page, limit };
  }

  async findNotificationById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  // ── Notification Preferences Operations ─────────────────────
  async findPreferencesByUserId(userId: string) {
    return prisma.notificationPreference.findUnique({
      where: { userId },
    });
  }

  async createDefaultPreferences(userId: string) {
    return prisma.notificationPreference.create({
      data: {
        userId,
        inAppEnabled: true,
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: true,
      },
    });
  }

  async updatePreferences(userId: string, payload: UpdatePreferencesPayload) {
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: payload,
      create: {
        userId,
        inAppEnabled: payload.inAppEnabled ?? true,
        pushEnabled: payload.pushEnabled ?? true,
        emailEnabled: payload.emailEnabled ?? true,
        smsEnabled: payload.smsEnabled ?? true,
      },
    });
  }

  // ── Review Operations ─────────────────────────────────────────
  async findBookingById(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
      },
    });
  }

  async findReviewByUserBookingTarget(
    userId: string,
    bookingId: string,
    targetType: any,
    targetId: string
  ) {
    return prisma.review.findUnique({
      where: {
        userId_bookingId_targetType_targetId: {
          userId,
          bookingId,
          targetType,
          targetId,
        },
      },
    });
  }

  async createReview(userId: string, payload: CreateReviewPayload) {
    return prisma.review.create({
      data: {
        userId,
        bookingId: payload.bookingId,
        targetType: payload.targetType,
        targetId: payload.targetId,
        rating: payload.rating,
        title: payload.title,
        comment: payload.comment,
        status: ReviewStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        response: true,
      },
    });
  }

  async findReviews(filter: GetReviewsFilter) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};

    if (filter.targetType) {
      where.targetType = filter.targetType;
    }
    if (filter.targetId) {
      where.targetId = filter.targetId;
    }
    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = ReviewStatus.PUBLISHED; // Default to public published reviews
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          response: true,
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total, page, limit };
  }

  async findReviewsByUserId(userId: string) {
    return prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        response: true,
      },
    });
  }

  async findReviewById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        response: true,
      },
    });
  }

  async updateReview(id: string, payload: UpdateReviewPayload) {
    return prisma.review.update({
      where: { id },
      data: payload,
      include: {
        response: true,
      },
    });
  }

  async deleteReview(id: string) {
    return prisma.review.update({
      where: { id },
      data: {
        status: ReviewStatus.HIDDEN,
      },
    });
  }

  // ── Review Response Operations ──────────────────────────────
  async findResponseByReviewId(reviewId: string) {
    return prisma.reviewResponse.findUnique({
      where: { reviewId },
    });
  }

  async createReviewResponse(
    reviewId: string,
    responderId: string,
    payload: CreateReviewResponsePayload
  ) {
    return prisma.reviewResponse.create({
      data: {
        reviewId,
        responderId,
        responseText: payload.responseText,
      },
    });
  }
}
