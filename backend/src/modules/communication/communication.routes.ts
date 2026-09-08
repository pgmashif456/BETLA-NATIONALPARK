import { Router } from 'express';
import { CommunicationController } from './communication.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();
const controller = new CommunicationController();

// ── Notifications Routes (Authenticated Users) ─────────────
router.get('/notifications', authenticate, controller.getNotifications);
router.patch('/notifications/read-all', authenticate, controller.markAllNotificationsRead);
router.patch('/notifications/:id/read', authenticate, controller.markNotificationRead);

// ── Notification Preferences Routes (Authenticated Users) ────
router.get('/notifications/preferences', authenticate, controller.getPreferences);
router.patch('/notifications/preferences', authenticate, controller.updatePreferences);

// ── Reviews Routes ──────────────────────────────────────────
router.get('/reviews', controller.getPublicReviews);
router.get('/reviews/me', authenticate, controller.getUserReviews);
router.post('/reviews', authenticate, controller.createReview);
router.patch('/reviews/:id', authenticate, controller.updateReview);
router.delete('/reviews/:id', authenticate, controller.deleteReview);

// ── Review Response Routes ──────────────────────────────────
router.post(
  '/reviews/:id/responses',
  authenticate,
  requireRole('GUIDE', 'HOMESTAY', 'ADMIN', 'FOREST_AUTHORITY'),
  controller.createReviewResponse
);

export default router;
