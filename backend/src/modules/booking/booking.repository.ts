// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module: Booking Repository
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../../database/client';
import {
  BookingStatus,
  PaymentStatus,
  CancellationStatus,
  TripStatus,
  Prisma,
} from '@prisma/client';
import {
  CreateBookingInput,
  QueryBookingParams,
  CreateTripInput,
  CreateTripItemInput,
  QueryTripParams,
} from './booking.types';

export class BookingRepository {
  // ── Bookings ──────────────────────────────────────────────────

  async createBooking(
    userId: string,
    referenceNo: string,
    totalAmount: Prisma.Decimal,
    itemsWithPrices: {
      itemType: any;
      itemId: string;
      unitPrice: Prisma.Decimal;
      quantity: number;
      subtotal: Prisma.Decimal;
    }[],
    guests: CreateBookingInput['guests']
  ) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId,
          referenceNo,
          totalAmount,
          status: BookingStatus.PENDING,
          currency: 'INR',
          items: {
            create: itemsWithPrices.map((item) => ({
              itemType: item.itemType,
              itemId: item.itemId,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          },
          guests: {
            create: guests.map((g) => ({
              fullName: g.fullName,
              age: g.age,
              idProofType: g.idProofType,
              idProofNumber: g.idProofNumber,
            })),
          },
        },
        include: {
          items: true,
          guests: true,
          payments: true,
          cancellation: true,
        },
      });

      return booking;
    });
  }

  async findBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        items: true,
        guests: true,
        payments: true,
        cancellation: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findBookings(params: QueryBookingParams) {
    const where: Prisma.BookingWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }
    if (params.userId) {
      where.userId = params.userId;
    }

    return prisma.booking.findMany({
      where,
      include: {
        items: true,
        guests: true,
        payments: true,
        cancellation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        guests: true,
        payments: true,
        cancellation: true,
      },
    });
  }

  // ── Payments ──────────────────────────────────────────────────

  async createPaymentTransaction(
    bookingId: string,
    amount: Prisma.Decimal,
    paymentMethod: string,
    gatewayTransactionId?: string
  ) {
    return prisma.paymentTransaction.create({
      data: {
        bookingId,
        amount,
        paymentMethod,
        gatewayTransactionId,
        status: PaymentStatus.INITIATED,
      },
    });
  }

  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    gatewayTransactionId?: string
  ) {
    return prisma.paymentTransaction.update({
      where: { id },
      data: {
        status,
        ...(gatewayTransactionId ? { gatewayTransactionId } : {}),
      },
    });
  }

  async findPaymentByBookingAndGatewayId(bookingId: string, gatewayId: string) {
    return prisma.paymentTransaction.findFirst({
      where: {
        bookingId,
        gatewayTransactionId: gatewayId,
      },
    });
  }

  // ── Cancellations ─────────────────────────────────────────────

  async createCancellation(
    bookingId: string,
    cancelledById: string,
    reason: string,
    refundAmount: Prisma.Decimal
  ) {
    return prisma.$transaction(async (tx) => {
      // Create cancellation record
      const cancellation = await tx.bookingCancellation.create({
        data: {
          bookingId,
          cancelledById,
          reason,
          refundAmount,
          status: CancellationStatus.PENDING,
        },
      });

      // Update booking status to CANCELLED
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      return cancellation;
    });
  }

  async updateCancellationStatus(id: string, status: CancellationStatus) {
    return prisma.bookingCancellation.update({
      where: { id },
      data: { status },
    });
  }

  // ── Trips ─────────────────────────────────────────────────────

  async createTrip(userId: string, input: CreateTripInput) {
    return prisma.trip.create({
      data: {
        userId,
        title: input.title,
        startDate: input.startDate,
        endDate: input.endDate,
        status: input.status || TripStatus.DRAFT,
      },
      include: { items: true },
    });
  }

  async findTripById(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            booking: true,
          },
        },
      },
    });
  }

  async findTrips(params: QueryTripParams) {
    const where: Prisma.TripWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }
    if (params.userId) {
      where.userId = params.userId;
    }

    return prisma.trip.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTripItem(tripId: string, input: CreateTripItemInput) {
    return prisma.tripItem.create({
      data: {
        tripId,
        bookingId: input.bookingId,
        itemType: input.itemType,
        itemId: input.itemId,
        notes: input.notes,
      },
    });
  }
}
