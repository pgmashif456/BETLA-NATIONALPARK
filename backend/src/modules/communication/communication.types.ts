import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  ReviewTargetType,
  ReviewStatus,
} from '@prisma/client';

export interface SendNotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channel?: NotificationChannel;
}

export interface UpdatePreferencesPayload {
  inAppEnabled?: boolean;
  pushEnabled?: boolean;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
}

export interface CreateReviewPayload {
  bookingId: string;
  targetType: ReviewTargetType;
  targetId: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface CreateReviewResponsePayload {
  responseText: string;
}

export interface GetNotificationsFilter {
  unreadOnly?: boolean;
  status?: NotificationStatus;
  type?: NotificationType;
  page?: number;
  limit?: number;
}

export interface GetReviewsFilter {
  targetType?: ReviewTargetType;
  targetId?: string;
  status?: ReviewStatus;
  page?: number;
  limit?: number;
}
