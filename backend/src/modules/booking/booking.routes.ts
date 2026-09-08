// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module: Booking Routes
// ═══════════════════════════════════════════════════════════════

import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  initiatePayment,
  processPaymentWebhook,
  createTrip,
  getTrips,
  getTripById,
  createTripItem,
} from './booking.controller';

const router = Router();

// ── Bookings Routes ───────────────────────────────────────────
router.post('/bookings', authenticate, createBooking);
router.get('/bookings', authenticate, getBookings);
router.get('/bookings/:id', authenticate, getBookingById);
router.post('/bookings/:id/cancel', authenticate, cancelBooking);

// ── Payment Routes ────────────────────────────────────────────
router.post('/payments/initiate', authenticate, initiatePayment);
router.post('/payments/webhook', processPaymentWebhook);

// ── Trips Routes ──────────────────────────────────────────────
router.post('/trips', authenticate, createTrip);
router.get('/trips', authenticate, getTrips);
router.get('/trips/:id', authenticate, getTripById);
router.post('/trips/:id/items', authenticate, createTripItem);

export default router;
