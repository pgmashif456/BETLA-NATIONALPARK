import { Request, Response, NextFunction } from 'express';
import { CommunicationService } from './communication.service';
import {
  updatePreferencesSchema,
  createReviewSchema,
  updateReviewSchema,
  createReviewResponseSchema,
  getNotificationsQuerySchema,
  getReviewsQuerySchema,
} from './communication.validation';

const communicationService = new CommunicationService();

export class CommunicationController {
  // ── Notifications Handlers ──────────────────────────────────
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const filter = getNotificationsQuerySchema.parse(req.query);
      const result = await communicationService.getUserNotifications(userId, filter);

      res.status(200).json({
        success: true,
        data: result.notifications,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const id = req.params.id as string;
      const notification = await communicationService.markNotificationAsRead(userId, id);

      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllNotificationsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await communicationService.markAllNotificationsAsRead(userId);

      res.status(200).json({
        success: true,
        data: {
          updatedCount: result.count,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Notification Preferences Handlers ───────────────────────
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const preferences = await communicationService.getPreferences(userId);

      res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const payload = updatePreferencesSchema.parse(req.body);
      const preferences = await communicationService.updatePreferences(userId, payload);

      res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Reviews Handlers ────────────────────────────────────────
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const payload = createReviewSchema.parse(req.body);
      const review = await communicationService.createReview(userId, payload);

      res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = getReviewsQuerySchema.parse(req.query);
      const result = await communicationService.getPublicReviews(filter);

      res.status(200).json({
        success: true,
        data: result.reviews,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const reviews = await communicationService.getUserReviews(userId);

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const id = req.params.id as string;
      const payload = updateReviewSchema.parse(req.body);
      const review = await communicationService.updateReview(userId, id, payload);

      res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const id = req.params.id as string;
      await communicationService.deleteReview(userId, id);

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Review Response Handlers ────────────────────────────────
  async createReviewResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const responderId = (req as any).user.id;
      const id = req.params.id as string;
      const payload = createReviewResponseSchema.parse(req.body);
      const response = await communicationService.createReviewResponse(responderId, id, payload);

      res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
