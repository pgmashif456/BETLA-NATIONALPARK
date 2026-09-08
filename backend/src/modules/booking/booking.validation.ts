// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module: Booking Validation
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import {
  BookingItemType,
  IdProofType,
  PaymentStatus,
  TripStatus,
} from '@prisma/client';

export const bookingGuestSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(150),
  age: z.number().int().min(0, 'Age cannot be negative').max(120, 'Age cannot exceed 120'),
  idProofType: z.nativeEnum(IdProofType, {
    errorMap: () => ({ message: 'Invalid ID proof type' }),
  }),
  idProofNumber: z.string().min(3, 'ID proof number required').max(100),
});

export const bookingItemSchema = z.object({
  itemType: z.nativeEnum(BookingItemType, {
    errorMap: () => ({ message: 'Invalid booking item type' }),
  }),
  itemId: z.string().uuid('Invalid item ID format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const createBookingSchema = z.object({
  items: z.array(bookingItemSchema).min(1, 'At least one booking item is required'),
  guests: z.array(bookingGuestSchema).min(1, 'At least one guest is required'),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(5, 'Cancellation reason must be at least 5 characters'),
});

export const initiatePaymentSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID format'),
  paymentMethod: z.string().min(2).max(50),
});

export const processPaymentWebhookSchema = z.object({
  gatewayTransactionId: z.string().min(1, 'Gateway transaction ID required'),
  bookingId: z.string().uuid('Invalid booking ID format'),
  status: z.nativeEnum(PaymentStatus, {
    errorMap: () => ({ message: 'Invalid payment status' }),
  }),
  paymentMethod: z.string().max(50).optional(),
});

export const createTripSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)),
  endDate: z.string().or(z.date()).transform((val) => new Date(val)),
  status: z.nativeEnum(TripStatus).optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be greater than or equal to start date',
  path: ['endDate'],
});

export const createTripItemSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID format').optional(),
  itemType: z.string().min(2).max(50),
  itemId: z.string().uuid('Invalid item ID format'),
  notes: z.string().max(1000).optional(),
});
