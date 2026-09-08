// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module: Booking Types
// ═══════════════════════════════════════════════════════════════

import {
  BookingStatus,
  BookingItemType,
  IdProofType,
  PaymentStatus,
  TripStatus,
} from '@prisma/client';

export interface BookingGuestInput {
  fullName: string;
  age: number;
  idProofType: IdProofType;
  idProofNumber: string;
}

export interface BookingItemInput {
  itemType: BookingItemType;
  itemId: string;
  quantity: number;
}

export interface CreateBookingInput {
  items: BookingItemInput[];
  guests: BookingGuestInput[];
}

export interface CancelBookingInput {
  reason: string;
}

export interface InitiatePaymentInput {
  bookingId: string;
  paymentMethod: string;
}

export interface ProcessPaymentWebhookInput {
  gatewayTransactionId: string;
  bookingId: string;
  status: PaymentStatus;
  paymentMethod?: string;
}

export interface CreateTripInput {
  title: string;
  startDate: Date;
  endDate: Date;
  status?: TripStatus;
}

export interface CreateTripItemInput {
  bookingId?: string;
  itemType: string;
  itemId: string;
  notes?: string;
}

export interface QueryBookingParams {
  status?: BookingStatus;
  userId?: string;
}

export interface QueryTripParams {
  status?: TripStatus;
  userId?: string;
}
