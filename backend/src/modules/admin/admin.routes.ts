// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 8: Admin Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { authenticate, requireRole } from '../auth/auth.middleware';
import {
  getUsers,
  updateUserStatus,
  getRoles,
  createRole,
  updateRole,
  getAuditLogs,
  getDashboard,
  getReports,
  getSettings,
  updateSetting,
} from './admin.controller';

const router = Router();

// Apply authentication to all admin endpoints
router.use(authenticate);

// ── Read-Only Dashboard & Reports (ADMIN + FOREST_AUTHORITY) ──
router.get('/dashboard', requireRole('ADMIN', 'FOREST_AUTHORITY'), getDashboard);
router.get('/reports', requireRole('ADMIN', 'FOREST_AUTHORITY'), getReports);

// ── Strict Admin Management Endpoints (ADMIN ONLY) ───────────
router.get('/users', requireRole('ADMIN'), getUsers);
router.patch('/users/:id/status', requireRole('ADMIN'), updateUserStatus);

router.get('/roles', requireRole('ADMIN'), getRoles);
router.post('/roles', requireRole('ADMIN'), createRole);
router.put('/roles/:id', requireRole('ADMIN'), updateRole);

router.get('/audit-logs', requireRole('ADMIN'), getAuditLogs);

router.get('/settings', requireRole('ADMIN'), getSettings);
router.put('/settings/:key', requireRole('ADMIN'), updateSetting);

export default router;
