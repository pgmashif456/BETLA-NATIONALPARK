// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 5: Eco Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import {
  authenticate,
  optionalAuthenticate,
  requireRole,
} from '../auth/auth.middleware';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  assignReport,
  getActivities,
  createActivity,
  updateActivity,
} from './eco.controller';

const router = Router();

// ── Eco Reports ───────────────────────────────────────────────
router.post('/eco/reports', optionalAuthenticate, createReport);
router.get('/eco/reports', authenticate, getReports);
router.get('/eco/reports/:id', authenticate, getReportById);

router.patch(
  '/eco/reports/:id/status',
  authenticate,
  requireRole('ADMIN', 'FOREST_AUTHORITY'),
  updateReportStatus
);

router.patch(
  '/eco/reports/:id/assign',
  authenticate,
  requireRole('ADMIN', 'FOREST_AUTHORITY'),
  assignReport
);

// ── Eco Activities ────────────────────────────────────────────
router.get('/eco/activities', optionalAuthenticate, getActivities);
router.post(
  '/eco/activities',
  authenticate,
  requireRole('ADMIN', 'FOREST_AUTHORITY'),
  createActivity
);
router.put(
  '/eco/activities/:id',
  authenticate,
  requireRole('ADMIN', 'FOREST_AUTHORITY'),
  updateActivity
);

export default router;
