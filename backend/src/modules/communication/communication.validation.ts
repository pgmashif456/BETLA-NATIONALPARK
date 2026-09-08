import { z } from 'zod';
import {
  NotificationStatus,
  NotificationType,
  ReviewTargetType,
  ReviewStatus,
} from '@prisma/client';

export const updatePreferencesSchema = z.object({
  inAppEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
});

export const createReviewSchema = z.object({
  bookingId: z.string().uuid('Invalid bookingId format'),
  targetType: z.nativeEnum(ReviewTargetType, {
    errorMap: () => ({ message: 'Invalid targetType. Must be GUIDE_SERVICE or HOMESTAY_PROPERTY' }),
  }),
  targetId: z.string().uuid('Invalid targetId format'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().max(200, 'Title cannot exceed 200 characters').optional(),
  comment: z.string().min(3, 'Comment must be at least 3 characters'),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(200).optional(),
  comment: z.string().min(3).optional(),
});

export const createReviewResponseSchema = z.object({
  responseText: z.string().min(3, 'Response text must be at least 3 characters'),
});

export const getNotificationsQuerySchema = z.object({
  unreadOnly: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  status: z.nativeEnum(NotificationStatus).optional(),
  type: z.nativeEnum(NotificationType).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const getReviewsQuerySchema = z.object({
  targetType: z.nativeEnum(ReviewTargetType).optional(),
  targetId: z.string().uuid().optional(),
  status: z.nativeEnum(ReviewStatus).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
