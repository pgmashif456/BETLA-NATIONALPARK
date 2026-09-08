import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();
const controller = new AnalyticsController();

// Protect all analytics endpoints: Authentication + ADMIN or FOREST_AUTHORITY
router.use('/analytics', authenticate, requireRole('ADMIN', 'FOREST_AUTHORITY'));

router.get('/analytics/overview', controller.getOverview);
router.get('/analytics/tourism', controller.getTourism);
router.get('/analytics/bookings', controller.getBookings);
router.get('/analytics/safety', controller.getSafety);
router.get('/analytics/eco', controller.getEco);
router.get('/analytics/users', controller.getUsers);

export default router;
