// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module: Booking Service
// ═══════════════════════════════════════════════════════════════

import { Prisma, BookingStatus, PaymentStatus, CancellationStatus } from '@prisma/client';
import { BookingRepository } from './booking.repository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../common/errors/AppError';
import {
  CreateBookingInput,
  CancelBookingInput,
  InitiatePaymentInput,
  ProcessPaymentWebhookInput,
  CreateTripInput,
  CreateTripItemInput,
  QueryBookingParams,
  QueryTripParams,
} from './booking.types';
import { BOOKING_ERROR_CODES } from './booking.constants';
import { prisma } from '../../database/client';

export class BookingService {
  private repository: BookingRepository;

  constructor() {
    this.repository = new BookingRepository();
  }

  // ── Bookings Management ───────────────────────────────────────

  async createBooking(userId: string, input: CreateBookingInput) {
    if (!input.items || input.items.length === 0) {
      throw new BadRequestError('At least one booking item is required', BOOKING_ERROR_CODES.INVALID_BOOKING_ITEM);
    }
    if (!input.guests || input.guests.length === 0) {
      throw new BadRequestError('At least one guest is required', BOOKING_ERROR_CODES.INVALID_GUEST_DETAILS);
    }

    // Validate guests age
    for (const guest of input.guests) {
      if (guest.age < 0 || guest.age > 120) {
        throw new BadRequestError(
          `Guest ${guest.fullName} age must be between 0 and 120`,
          BOOKING_ERROR_CODES.INVALID_GUEST_DETAILS
        );
      }
    }

    // Calculate server-side prices for items
    let totalAmountCalc = new Prisma.Decimal(0);
    const itemsWithPrices = [];

    for (const item of input.items) {
      let unitPrice = new Prisma.Decimal(1000.00); // Base fallback rate

      if (item.itemType === 'GUIDE_SERVICE') {
        const guide = await prisma.guideProfile.findUnique({ where: { id: item.itemId } });
        if (!guide) {
          throw new NotFoundError(
            `Guide profile with ID ${item.itemId} not found`,
            BOOKING_ERROR_CODES.INVALID_BOOKING_ITEM
          );
        }
        // Base guide rate per service
        unitPrice = new Prisma.Decimal(1500.00);
      } else if (item.itemType === 'HOMESTAY_ROOM') {
        const homestay = await prisma.homestayProfile.findUnique({ where: { id: item.itemId } });
        if (!homestay) {
          throw new NotFoundError(
            `Homestay profile with ID ${item.itemId} not found`,
            BOOKING_ERROR_CODES.INVALID_BOOKING_ITEM
          );
        }
        // Base homestay rate per room/night
        unitPrice = new Prisma.Decimal(2500.00);
      }

      const subtotal = unitPrice.mul(item.quantity);
      totalAmountCalc = totalAmountCalc.add(subtotal);

      itemsWithPrices.push({
        itemType: item.itemType,
        itemId: item.itemId,
        unitPrice,
        quantity: item.quantity,
        subtotal,
      });
    }

    const referenceNo = `BK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return this.repository.createBooking(
      userId,
      referenceNo,
      totalAmountCalc,
      itemsWithPrices,
      input.guests
    );
  }

  async getBookingById(id: string, userId?: string, userRole?: string) {
    const booking = await this.repository.findBookingById(id);
    if (!booking) {
      throw new NotFoundError(
        `Booking with ID ${id} not found`,
        BOOKING_ERROR_CODES.BOOKING_NOT_FOUND
      );
    }

    // Access control: Admin/Forest Authority, or Owner of booking
    const isMgmt = userRole === 'ADMIN' || userRole === 'FOREST_AUTHORITY';
    const isOwner = userId && booking.userId === userId;

    if (!isMgmt && !isOwner) {
      throw new ForbiddenError(
        'You are not authorized to access this booking',
        BOOKING_ERROR_CODES.UNAUTHORIZED_BOOKING_ACCESS
      );
    }

    return booking;
  }

  async getBookings(params: QueryBookingParams, userId?: string, userRole?: string) {
    const queryParams: QueryBookingParams = { ...params };
    const isMgmt = userRole === 'ADMIN' || userRole === 'FOREST_AUTHORITY';

    // If non-mgmt, restrict to user's own bookings
    if (!isMgmt && userId) {
      queryParams.userId = userId;
    }

    return this.repository.findBookings(queryParams);
  }

  async cancelBooking(id: string, userId: string, userRole: string | undefined, input: CancelBookingInput) {
    const booking = await this.repository.findBookingById(id);
    if (!booking) {
      throw new NotFoundError(
        `Booking with ID ${id} not found`,
        BOOKING_ERROR_CODES.BOOKING_NOT_FOUND
      );
    }

    // Access control
    const isMgmt = userRole === 'ADMIN' || userRole === 'FOREST_AUTHORITY';
    const isOwner = booking.userId === userId;

    if (!isMgmt && !isOwner) {
      throw new ForbiddenError(
        'You are not authorized to cancel this booking',
        BOOKING_ERROR_CODES.UNAUTHORIZED_BOOKING_ACCESS
      );
    }

    // Eligibility check
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestError(
        'Booking is already cancelled',
        BOOKING_ERROR_CODES.BOOKING_ALREADY_CANCELLED
      );
    }

    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestError(
        `Booking in ${booking.status} state cannot be cancelled`,
        BOOKING_ERROR_CODES.BOOKING_NOT_CANCELLABLE
      );
    }

    // Calculate refund amount: if CONFIRMED, full amount refund due; if PENDING, 0 refund
    const refundAmount = booking.status === BookingStatus.CONFIRMED ? booking.totalAmount : new Prisma.Decimal(0);

    return this.repository.createCancellation(id, userId, input.reason, refundAmount);
  }

  // ── Payment Processing ────────────────────────────────────────

  async initiatePayment(userId: string, input: InitiatePaymentInput) {
    const booking = await this.repository.findBookingById(input.bookingId);
    if (!booking) {
      throw new NotFoundError(
        `Booking with ID ${input.bookingId} not found`,
        BOOKING_ERROR_CODES.BOOKING_NOT_FOUND
      );
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError(
        'You are not authorized to initiate payment for this booking',
        BOOKING_ERROR_CODES.UNAUTHORIZED_BOOKING_ACCESS
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestError(
        `Cannot initiate payment for booking in ${booking.status} state`,
        BOOKING_ERROR_CODES.INVALID_STATUS_TRANSITION
      );
    }

    const gatewayTransactionId = `PAY-TXN-${Date.now()}`;

    return this.repository.createPaymentTransaction(
      booking.id,
      booking.totalAmount,
      input.paymentMethod,
      gatewayTransactionId
    );
  }

  async processPaymentWebhook(input: ProcessPaymentWebhookInput) {
    const booking = await this.repository.findBookingById(input.bookingId);
    if (!booking) {
      throw new NotFoundError(
        `Booking with ID ${input.bookingId} not found`,
        BOOKING_ERROR_CODES.BOOKING_NOT_FOUND
      );
    }

    // Check existing payment transaction or create one
    let payment = await this.repository.findPaymentByBookingAndGatewayId(
      input.bookingId,
      input.gatewayTransactionId
    );

    if (!payment) {
      payment = await this.repository.createPaymentTransaction(
        input.bookingId,
        booking.totalAmount,
        input.paymentMethod || 'ONLINE',
        input.gatewayTransactionId
      );
    }

    // Update payment status
    const updatedPayment = await this.repository.updatePaymentStatus(
      payment.id,
      input.status,
      input.gatewayTransactionId
    );

    // Sync booking status
    if (input.status === PaymentStatus.SUCCESSFUL && booking.status === BookingStatus.PENDING) {
      await this.repository.updateBookingStatus(booking.id, BookingStatus.CONFIRMED);
    } else if (input.status === PaymentStatus.REFUNDED) {
      if (booking.cancellation) {
        await this.repository.updateCancellationStatus(booking.cancellation.id, CancellationStatus.COMPLETED);
      }
    }

    return updatedPayment;
  }

  // ── Trips Management ──────────────────────────────────────────

  async createTrip(userId: string, input: CreateTripInput) {
    if (input.endDate < input.startDate) {
      throw new BadRequestError('Trip end date must be greater than or equal to start date');
    }

    return this.repository.createTrip(userId, input);
  }

  async getTripById(id: string, userId?: string) {
    const trip = await this.repository.findTripById(id);
    if (!trip) {
      throw new NotFoundError(
        `Trip with ID ${id} not found`,
        BOOKING_ERROR_CODES.TRIP_NOT_FOUND
      );
    }

    if (userId && trip.userId !== userId) {
      throw new ForbiddenError('You are not authorized to view this trip');
    }

    return trip;
  }

  async getTrips(params: QueryTripParams, userId?: string) {
    const queryParams = { ...params };
    if (userId) {
      queryParams.userId = userId;
    }

    return this.repository.findTrips(queryParams);
  }

  async createTripItem(tripId: string, userId: string, input: CreateTripItemInput) {
    const trip = await this.repository.findTripById(tripId);
    if (!trip) {
      throw new NotFoundError(
        `Trip with ID ${tripId} not found`,
        BOOKING_ERROR_CODES.TRIP_NOT_FOUND
      );
    }

    if (trip.userId !== userId) {
      throw new ForbiddenError('You are not authorized to add items to this trip');
    }

    // If bookingId provided, verify booking belongs to user
    if (input.bookingId) {
      const booking = await this.repository.findBookingById(input.bookingId);
      if (!booking || booking.userId !== userId) {
        throw new BadRequestError('Invalid booking ID for trip item');
      }
    }

    return this.repository.createTripItem(tripId, input);
  }
}
