// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 3: Content Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import {
  authenticate,
  optionalAuthenticate,
  requirePermission,
} from '../auth/auth.middleware';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  getCategories,
  getDiscoverData,
  getNearbyDestinations,
} from './content.controller';

const router = Router();

// ── Categories & Discover ─────────────────────────────────────
router.get('/categories', getCategories);
router.get('/discover', getDiscoverData);

// ── Destinations ──────────────────────────────────────────────
router.get('/destinations/nearby', getNearbyDestinations);
router.get('/destinations', optionalAuthenticate, getDestinations);
router.get('/destinations/:id', optionalAuthenticate, getDestinationById);
router.post(
  '/destinations',
  authenticate,
  requirePermission('destinations:create'),
  createDestination
);
router.patch(
  '/destinations/:id',
  authenticate,
  requirePermission('destinations:update'),
  updateDestination
);
router.delete(
  '/destinations/:id',
  authenticate,
  requirePermission('destinations:delete'),
  deleteDestination
);

// ── Attractions ───────────────────────────────────────────────
router.get('/attractions', optionalAuthenticate, getAttractions);
router.get('/attractions/:id', optionalAuthenticate, getAttractionById);
router.post(
  '/attractions',
  authenticate,
  requirePermission('destinations:create'),
  createAttraction
);
router.patch(
  '/attractions/:id',
  authenticate,
  requirePermission('destinations:update'),
  updateAttraction
);

// ── Experiences ───────────────────────────────────────────────
router.get('/experiences', optionalAuthenticate, getExperiences);
router.get('/experiences/:id', optionalAuthenticate, getExperienceById);
router.post(
  '/experiences',
  authenticate,
  requirePermission('destinations:create'),
  createExperience
);
router.patch(
  '/experiences/:id',
  authenticate,
  requirePermission('destinations:update'),
  updateExperience
);

// ── Activities ────────────────────────────────────────────────
router.get('/activities', optionalAuthenticate, getActivities);
router.get('/activities/:id', optionalAuthenticate, getActivityById);
router.post(
  '/activities',
  authenticate,
  requirePermission('destinations:create'),
  createActivity
);
router.patch(
  '/activities/:id',
  authenticate,
  requirePermission('destinations:update'),
  updateActivity
);

export default router;
