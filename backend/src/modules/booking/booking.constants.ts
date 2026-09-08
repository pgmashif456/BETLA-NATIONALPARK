// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module: Booking Constants
// ═══════════════════════════════════════════════════════════════

import { BookingStatus } from '@prisma/client';

export const ALLOWED_BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.EXPIRED],
  [BookingStatus.CONFIRMED]: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [BookingStatus.COMPLETED],
  [BookingStatus.CANCELLED]: [BookingStatus.CANCELLED],
  [BookingStatus.EXPIRED]: [BookingStatus.EXPIRED],
};

export function isValidBookingStatusTransition(current: BookingStatus, next: BookingStatus): boolean {
  const allowed = ALLOWED_BOOKING_STATUS_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

export const BOOKING_ERROR_CODES = {
  BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  UNAUTHORIZED_BOOKING_ACCESS: 'UNAUTHORIZED_BOOKING_ACCESS',
  BOOKING_ALREADY_CANCELLED: 'BOOKING_ALREADY_CANCELLED',
  BOOKING_NOT_CANCELLABLE: 'BOOKING_NOT_CANCELLABLE',
  INVALID_BOOKING_ITEM: 'INVALID_BOOKING_ITEM',
  INVALID_GUEST_DETAILS: 'INVALID_GUEST_DETAILS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  TRIP_NOT_FOUND: 'TRIP_NOT_FOUND',
} as const;
