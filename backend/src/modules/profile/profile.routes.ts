import { Router } from 'express';
import { profileController } from './profile.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

// ── Generic Profile Endpoints ─────────────────────────────────
router.get('/profile', authenticate, profileController.getProfile);
router.patch('/profile', authenticate, profileController.updateProfile);

// ── Tourist Profile Endpoints ─────────────────────────────────
router.get('/tourist/profile', authenticate, profileController.getTouristProfile);
router.patch('/tourist/profile', authenticate, profileController.updateTouristProfile);

// ── Guide Profile Endpoints ───────────────────────────────────
router.get('/guide/profile', authenticate, profileController.getGuideProfile);
router.patch('/guide/profile', authenticate, profileController.updateGuideProfile);
router.post('/guide/profile/verification', authenticate, profileController.submitGuideVerification);
router.get('/guide/profile/verification', authenticate, profileController.getGuideVerification);

// ── Homestay Profile Endpoints ────────────────────────────────
router.get('/homestay/profile', authenticate, profileController.getHomestayProfile);
router.patch('/homestay/profile', authenticate, profileController.updateHomestayProfile);
router.post('/homestay/profile/verification', authenticate, profileController.submitHomestayVerification);
router.get('/homestay/profile/verification', authenticate, profileController.getHomestayVerification);

export default router;
