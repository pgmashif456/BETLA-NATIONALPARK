import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/database/client';

describe('Module: Booking, Trip & Transaction Management Integration Tests', () => {
  let touristToken: string;
  let touristId: string;
  let secondTouristToken: string;
  let secondTouristId: string;
  let adminToken: string;
  let adminId: string;

  let testGuideId: string;
  let testHomestayId: string;
  let createdBookingId: string;
  let createdTripId: string;

  beforeAll(async () => {
    // Ensure roles exist
    const touristRole = await prisma.role.upsert({
      where: { name: 'TOURIST' },
      update: {},
      create: { name: 'TOURIST', description: 'Tourist' },
    });

    const guideRole = await prisma.role.upsert({
      where: { name: 'GUIDE' },
      update: {},
      create: { name: 'GUIDE', description: 'Guide' },
    });

    const homestayRole = await prisma.role.upsert({
      where: { name: 'HOMESTAY' },
      update: {},
      create: { name: 'HOMESTAY', description: 'Homestay' },
    });

    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN', description: 'Admin' },
    });

    // Create Users for Guide & Homestay target profiles
    const guideUser = await prisma.user.create({
      data: {
        email: `guide-bk-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Guide',
        lastName: 'Target',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: guideRole.id,
      },
    });

    const homestayUser = await prisma.user.create({
      data: {
        email: `homestay-bk-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Homestay',
        lastName: 'Owner',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: homestayRole.id,
      },
    });

    // Create Profiles
    const guideProfile = await prisma.guideProfile.create({
      data: {
        userId: guideUser.id,
        fullName: 'Betla Experienced Guide',
        experienceYears: 5,
        verificationStatus: 'VERIFIED',
      },
    });
    testGuideId = guideProfile.id;

    const homestayProfile = await prisma.homestayProfile.create({
      data: {
        userId: homestayUser.id,
        propertyName: 'Betla Green Canopy Homestay',
        ownerName: 'Homestay Owner',
        verificationStatus: 'VERIFIED',
      },
    });
    testHomestayId = homestayProfile.id;

    // Create Tourist Users
    const touristUser = await prisma.user.create({
      data: {
        email: `tourist-bk-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Tourist',
        lastName: 'Booker',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: touristRole.id,
      },
    });
    touristId = touristUser.id;

    const secondTouristUser = await prisma.user.create({
      data: {
        email: `tourist2-bk-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Second',
        lastName: 'Tourist',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: touristRole.id,
      },
    });
    secondTouristId = secondTouristUser.id;

    const adminUser = await prisma.user.create({
      data: {
        email: `admin-bk-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Admin',
        lastName: 'Manager',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: adminRole.id,
      },
    });
    adminId = adminUser.id;

    // JWT sign
    const jwt = require('jsonwebtoken');
    const { config } = require('../../src/config');

    touristToken = jwt.sign(
      { userId: touristId, email: touristUser.email, role: 'TOURIST', permissions: [], type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    secondTouristToken = jwt.sign(
      { userId: secondTouristId, email: secondTouristUser.email, role: 'TOURIST', permissions: [], type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { userId: adminId, email: adminUser.email, role: 'ADMIN', permissions: ['admin:dashboard'], type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    if (createdTripId) {
      await prisma.tripItem.deleteMany({ where: { tripId: createdTripId } });
      await prisma.trip.deleteMany({ where: { id: createdTripId } });
    }
    if (createdBookingId) {
      await prisma.paymentTransaction.deleteMany({ where: { bookingId: createdBookingId } });
      await prisma.bookingCancellation.deleteMany({ where: { bookingId: createdBookingId } });
      await prisma.bookingGuest.deleteMany({ where: { bookingId: createdBookingId } });
      await prisma.bookingItem.deleteMany({ where: { bookingId: createdBookingId } });
      await prisma.booking.deleteMany({ where: { id: createdBookingId } });
    }
  });

  // 1. Booking Creation & Pricing Calculation
  describe('POST /api/v1/bookings', () => {
    it('creates a new booking with guide and homestay line items and guest details', async () => {
      const res = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          items: [
            {
              itemType: 'GUIDE_SERVICE',
              itemId: testGuideId,
              quantity: 1,
            },
            {
              itemType: 'HOMESTAY_ROOM',
              itemId: testHomestayId,
              quantity: 2,
            },
          ],
          guests: [
            {
              fullName: 'Tourist Booker',
              age: 30,
              idProofType: 'AADHAAR',
              idProofNumber: '1111-2222-3333',
            },
            {
              fullName: 'Companion Traveler',
              age: 28,
              idProofType: 'PASSPORT',
              idProofNumber: 'A1234567',
            },
          ],
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.referenceNo).toMatch(/^BK-/);
      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.guests.length).toBe(2);

      // Server-side pricing verification: Guide (1500 * 1 = 1500) + Homestay (2500 * 2 = 5000) = 6500
      expect(parseFloat(res.body.data.totalAmount)).toBe(6500);

      createdBookingId = res.body.data.id;
    });

    it('rejects booking creation with non-existent guide profile ID', async () => {
      const res = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          items: [
            {
              itemType: 'GUIDE_SERVICE',
              itemId: '00000000-0000-0000-0000-000000000000',
              quantity: 1,
            },
          ],
          guests: [
            {
              fullName: 'Valid Guest',
              age: 25,
              idProofType: 'AADHAAR',
              idProofNumber: '9999-9999-9999',
            },
          ],
        })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_BOOKING_ITEM');
    });
  });

  // 2. Booking Retrieval & Ownership Access Control
  describe('GET /api/v1/bookings and GET /api/v1/bookings/:id', () => {
    it('allows booker to fetch their booking by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/bookings/${createdBookingId}`)
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdBookingId);
    });

    it('rejects unauthorized tourist viewing another user booking (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/bookings/${createdBookingId}`)
        .set('Authorization', `Bearer ${secondTouristToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED_BOOKING_ACCESS');
    });

    it('allows Admin to view any booking', async () => {
      const res = await request(app)
        .get(`/api/v1/bookings/${createdBookingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  // 3. Payment Processing & Webhook Status Sync
  describe('Payment Initiation & Webhook Flow', () => {
    it('initiates payment for pending booking', async () => {
      const res = await request(app)
        .post('/api/v1/payments/initiate')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          bookingId: createdBookingId,
          paymentMethod: 'UPI',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('INITIATED');
      expect(res.body.data.gatewayTransactionId).toBeDefined();
    });

    it('processes provider-agnostic payment webhook and advances booking status to CONFIRMED', async () => {
      const res = await request(app)
        .post('/api/v1/payments/webhook')
        .send({
          gatewayTransactionId: 'PAY-TXN-WEBHOOK-1234',
          bookingId: createdBookingId,
          status: 'SUCCESSFUL',
          paymentMethod: 'UPI',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('SUCCESSFUL');

      // Verify booking status was updated to CONFIRMED
      const bookingRes = await request(app)
        .get(`/api/v1/bookings/${createdBookingId}`)
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(bookingRes.body.data.status).toBe('CONFIRMED');
    });
  });

  // 4. Cancellation & Refund Handling
  describe('POST /api/v1/bookings/:id/cancel', () => {
    it('cancels confirmed booking and generates cancellation record with refund', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${createdBookingId}/cancel`)
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          reason: 'Emergency travel date conflict',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PENDING');
      expect(parseFloat(res.body.data.refundAmount)).toBe(6500);

      // Verify booking status is now CANCELLED
      const bookingRes = await request(app)
        .get(`/api/v1/bookings/${createdBookingId}`)
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(bookingRes.body.data.status).toBe('CANCELLED');
    });

    it('rejects cancelling an already cancelled booking', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${createdBookingId}/cancel`)
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          reason: 'Attempting second cancellation',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('BOOKING_ALREADY_CANCELLED');
    });
  });

  // 5. Trips Management API
  describe('Trips & Trip Items Endpoints', () => {
    it('allows tourist to create a standalone trip itinerary', async () => {
      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          title: 'Betla Safari Tour 2026',
          startDate: '2026-12-01T09:00:00.000Z',
          endDate: '2026-12-05T18:00:00.000Z',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Betla Safari Tour 2026');

      createdTripId = res.body.data.id;
    });

    it('allows tourist to add a booking item to their trip', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/items`)
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          bookingId: createdBookingId,
          itemType: 'GUIDE_SERVICE',
          itemId: testGuideId,
          notes: 'Morning safari trek with guide',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.tripId).toBe(createdTripId);
    });
  });

  // 6. M1, M2, M3, M4, M5 Regressions
  describe('M1, M2, M3, M4, M5 Regression Verification', () => {
    it('M1 Regression: Health check live OK', async () => {
      const res = await request(app).get('/health/live').expect(200);
      expect(res.body.data.status).toBe('alive');
    });

    it('M3 Regression: Categories fetch OK', async () => {
      const res = await request(app).get('/api/v1/categories').expect(200);
      expect(res.body.success).toBe(true);
    });

    it('M4 Regression: Safety alerts fetch OK', async () => {
      const res = await request(app).get('/api/v1/safety/alerts').expect(200);
      expect(res.body.success).toBe(true);
    });

    it('M5 Regression: Eco reports list OK', async () => {
      const res = await request(app)
        .get('/api/v1/eco/reports')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
    });
  });
});
