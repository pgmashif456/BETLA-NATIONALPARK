// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 4: Safety Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import {
  authenticate,
  optionalAuthenticate,
  requireRole,
} from '../auth/auth.middleware';
import {
  createEmergency,
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
  addIncidentUpdate,
  getSafetyAlerts,
  createSafetyAlert,
} from './safety.controller';

const router = Router();

// ── Emergency & Safety Alerts ─────────────────────────────────
router.post('/safety/emergency', optionalAuthenticate, createEmergency);
router.get('/safety/alerts', optionalAuthenticate, getSafetyAlerts);
router.post(
  '/safety/alerts',
  authenticate,
  requireRole('ADMIN', 'FOREST_AUTHORITY'),
  createSafetyAlert
);

// ── Incidents ─────────────────────────────────────────────────
router.post('/incidents', optionalAuthenticate, createIncident);
router.get('/incidents', authenticate, getIncidents);
router.get('/incidents/:id', authenticate, getIncidentById);

router.patch(
  '/incidents/:id/status',
  authenticate,
  updateIncidentStatus
);
router.patch(
  '/incidents/:id/assign',
  authenticate,
  requireRole('ADMIN', 'FOREST_AUTHORITY'),
  assignIncident
);
router.post('/incidents/:id/update', authenticate, addIncidentUpdate);

export default router;

