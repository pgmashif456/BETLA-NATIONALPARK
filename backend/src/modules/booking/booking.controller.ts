// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module: Booking Controller
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { BookingService } from './booking.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AuthenticatedRequest } from '../../common/types';
import {
  createBookingSchema,
  cancelBookingSchema,
  initiatePaymentSchema,
  processPaymentWebhookSchema,
  createTripSchema,
  createTripItemSchema,
} from './booking.validation';
import { BookingStatus, TripStatus } from '@prisma/client';

const bookingService = new BookingService();

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createBookingSchema.parse(req.body);
    const userId = req.user!.id;
    const booking = await bookingService.createBooking(userId, validatedData);
    sendSuccess(res, booking, 201);
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const params = {
      status: req.query.status as BookingStatus,
      userId: req.query.userId as string,
    };

    const bookings = await bookingService.getBookings(params, userId, userRole);
    sendSuccess(res, bookings);
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const booking = await bookingService.getBookingById(id, userId, userRole);
    sendSuccess(res, booking);
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const userRole = req.user?.role;
    const validatedData = cancelBookingSchema.parse(req.body);

    const cancellation = await bookingService.cancelBooking(id, userId, userRole, validatedData);
    sendSuccess(res, cancellation);
  } catch (error) {
    next(error);
  }
}

export async function initiatePayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const validatedData = initiatePaymentSchema.parse(req.body);

    const payment = await bookingService.initiatePayment(userId, validatedData);
    sendSuccess(res, payment, 201);
  } catch (error) {
    next(error);
  }
}

export async function processPaymentWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = processPaymentWebhookSchema.parse(req.body);
    const updatedPayment = await bookingService.processPaymentWebhook(validatedData);
    sendSuccess(res, updatedPayment);
  } catch (error) {
    next(error);
  }
}

export async function createTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const validatedData = createTripSchema.parse(req.body);

    const trip = await bookingService.createTrip(userId, validatedData);
    sendSuccess(res, trip, 201);
  } catch (error) {
    next(error);
  }
}

export async function getTrips(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const params = {
      status: req.query.status as TripStatus,
    };

    const trips = await bookingService.getTrips(params, userId);
    sendSuccess(res, trips);
  } catch (error) {
    next(error);
  }
}

export async function getTripById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const trip = await bookingService.getTripById(id, userId);
    sendSuccess(res, trip);
  } catch (error) {
    next(error);
  }
}

export async function createTripItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const tripId = req.params.id as string;
    const userId = req.user!.id;
    const validatedData = createTripItemSchema.parse(req.body);

    const tripItem = await bookingService.createTripItem(tripId, userId, validatedData);
    sendSuccess(res, tripItem, 201);
  } catch (error) {
    next(error);
  }
}
