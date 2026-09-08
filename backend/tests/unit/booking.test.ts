import { BookingStatus, TripStatus } from '@prisma/client';
import {
  isValidBookingStatusTransition,
  BOOKING_ERROR_CODES,
} from '../../src/modules/booking/booking.constants';
import {
  createBookingSchema,
  cancelBookingSchema,
  initiatePaymentSchema,
  createTripSchema,
} from '../../src/modules/booking/booking.validation';

describe('Module: Booking Unit Tests', () => {
  describe('Booking Lifecycle State Machine', () => {
    test('allows valid status transitions', () => {
      expect(isValidBookingStatusTransition(BookingStatus.PENDING, BookingStatus.CONFIRMED)).toBe(true);
      expect(isValidBookingStatusTransition(BookingStatus.PENDING, BookingStatus.CANCELLED)).toBe(true);
      expect(isValidBookingStatusTransition(BookingStatus.PENDING, BookingStatus.EXPIRED)).toBe(true);
      expect(isValidBookingStatusTransition(BookingStatus.CONFIRMED, BookingStatus.COMPLETED)).toBe(true);
      expect(isValidBookingStatusTransition(BookingStatus.CONFIRMED, BookingStatus.CANCELLED)).toBe(true);
    });

    test('rejects invalid status transitions', () => {
      expect(isValidBookingStatusTransition(BookingStatus.PENDING, BookingStatus.COMPLETED)).toBe(false);
      expect(isValidBookingStatusTransition(BookingStatus.COMPLETED, BookingStatus.CANCELLED)).toBe(false);
      expect(isValidBookingStatusTransition(BookingStatus.CANCELLED, BookingStatus.CONFIRMED)).toBe(false);
      expect(isValidBookingStatusTransition(BookingStatus.EXPIRED, BookingStatus.PENDING)).toBe(false);
    });

    test('allows same state transition', () => {
      expect(isValidBookingStatusTransition(BookingStatus.PENDING, BookingStatus.PENDING)).toBe(true);
      expect(isValidBookingStatusTransition(BookingStatus.CONFIRMED, BookingStatus.CONFIRMED)).toBe(true);
    });
  });

  describe('Booking Validation Schemas', () => {
    test('validates correct createBooking payload', () => {
      const payload = {
        items: [
          {
            itemType: 'GUIDE_SERVICE',
            itemId: '11111111-1111-1111-1111-111111111111',
            quantity: 1,
          },
        ],
        guests: [
          {
            fullName: 'Ramesh Kumar',
            age: 35,
            idProofType: 'AADHAAR',
            idProofNumber: '1234-5678-9012',
          },
        ],
      };
      const parsed = createBookingSchema.parse(payload);
      expect(parsed.guests[0].fullName).toBe('Ramesh Kumar');
      expect(parsed.items[0].quantity).toBe(1);
    });

    test('rejects invalid guest age (> 120)', () => {
      const payload = {
        items: [
          {
            itemType: 'GUIDE_SERVICE',
            itemId: '11111111-1111-1111-1111-111111111111',
            quantity: 1,
          },
        ],
        guests: [
          {
            fullName: 'Ramesh Kumar',
            age: 150,
            idProofType: 'AADHAAR',
            idProofNumber: '1234-5678-9012',
          },
        ],
      };
      expect(() => createBookingSchema.parse(payload)).toThrow();
    });

    test('rejects empty booking items array', () => {
      const payload = {
        items: [],
        guests: [
          {
            fullName: 'Ramesh Kumar',
            age: 35,
            idProofType: 'AADHAAR',
            idProofNumber: '1234-5678-9012',
          },
        ],
      };
      expect(() => createBookingSchema.parse(payload)).toThrow();
    });

    test('validates cancelBooking payload', () => {
      const payload = { reason: 'Personal emergency change of travel plans' };
      const parsed = cancelBookingSchema.parse(payload);
      expect(parsed.reason).toBe(payload.reason);
    });

    test('validates initiatePayment payload', () => {
      const payload = {
        bookingId: '22222222-2222-2222-2222-222222222222',
        paymentMethod: 'UPI',
      };
      const parsed = initiatePaymentSchema.parse(payload);
      expect(parsed.paymentMethod).toBe('UPI');
    });

    test('validates createTrip payload and end_date >= start_date', () => {
      const payload = {
        title: 'Betla Forest Excursion 2026',
        startDate: '2026-11-10T10:00:00.000Z',
        endDate: '2026-11-15T10:00:00.000Z',
      };
      const parsed = createTripSchema.parse(payload);
      expect(parsed.title).toBe(payload.title);
      expect(parsed.endDate.getTime()).toBeGreaterThanOrEqual(parsed.startDate.getTime());
    });

    test('rejects createTrip when endDate < startDate', () => {
      const payload = {
        title: 'Invalid Trip Dates',
        startDate: '2026-11-15T10:00:00.000Z',
        endDate: '2026-11-10T10:00:00.000Z',
      };
      expect(() => createTripSchema.parse(payload)).toThrow();
    });
  });

  describe('Booking Error Codes', () => {
    test('defines required error code constants', () => {
      expect(BOOKING_ERROR_CODES.BOOKING_NOT_FOUND).toBe('BOOKING_NOT_FOUND');
      expect(BOOKING_ERROR_CODES.INVALID_STATUS_TRANSITION).toBe('INVALID_STATUS_TRANSITION');
      expect(BOOKING_ERROR_CODES.UNAUTHORIZED_BOOKING_ACCESS).toBe('UNAUTHORIZED_BOOKING_ACCESS');
      expect(BOOKING_ERROR_CODES.BOOKING_NOT_CANCELLABLE).toBe('BOOKING_NOT_CANCELLABLE');
    });
  });
});
