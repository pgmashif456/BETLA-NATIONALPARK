import request from 'supertest';
import app from '../../src/app';
import { PrismaClient, RoleName, BookingStatus, BookingItemType, IdProofType } from '@prisma/client';
import { CommunicationService } from '../../src/modules/communication/communication.service';

const prisma = new PrismaClient();
const communicationService = new CommunicationService();

describe('Module 6 Integration Tests: Communication, Notifications & Reviews', () => {
  let touristToken: string;
  let touristUser: any;
  let anotherTouristToken: string;
  let anotherTouristUser: any;
  let guideToken: string;
  let guideUser: any;

  let completedBooking: any;
  let pendingBooking: any;
  const guideTargetId = '11111111-1111-1111-1111-111111111111';

  beforeAll(async () => {
    // 1. Get roles
    const touristRole = await prisma.role.findUnique({ where: { name: RoleName.TOURIST } });
    const guideRole = await prisma.role.findUnique({ where: { name: RoleName.GUIDE } });

    // 2. Create Tourist User 1
    touristUser = await prisma.user.create({
      data: {
        email: `m6_tourist_${Date.now()}@example.com`,
        passwordHash: '$2b$10$hashedpasswordplaceholder',
        firstName: 'M6Tourist',
        lastName: 'User',
        emailVerified: true,
        roleId: touristRole!.id,
      },
    });

    const loginRes1 = await request(app).post('/api/v1/auth/login').send({
      email: touristUser.email,
      password: 'Password123!',
    });
    // Use test token helper pattern
    touristToken = (await generateTestToken(touristUser.id, 'TOURIST'));

    // 3. Create Tourist User 2
    anotherTouristUser = await prisma.user.create({
      data: {
        email: `m6_tourist2_${Date.now()}@example.com`,
        passwordHash: '$2b$10$hashedpasswordplaceholder',
        firstName: 'OtherTourist',
        lastName: 'User',
        emailVerified: true,
        roleId: touristRole!.id,
      },
    });
    anotherTouristToken = await generateTestToken(anotherTouristUser.id, 'TOURIST');

    // 4. Create Guide User
    guideUser = await prisma.user.create({
      data: {
        email: `m6_guide_${Date.now()}@example.com`,
        passwordHash: '$2b$10$hashedpasswordplaceholder',
        firstName: 'M6Guide',
        lastName: 'User',
        emailVerified: true,
        roleId: guideRole!.id,
      },
    });
    guideToken = await generateTestToken(guideUser.id, 'GUIDE');

    // 5. Create a COMPLETED booking for Tourist 1 containing guide service item
    completedBooking = await prisma.booking.create({
      data: {
        userId: touristUser.id,
        referenceNo: `REF-M6-COMP-${Date.now()}`,
        status: BookingStatus.COMPLETED,
        totalAmount: 1500.0,
        currency: 'INR',
        items: {
          create: [
            {
              itemType: BookingItemType.GUIDE_SERVICE,
              itemId: guideTargetId,
              unitPrice: 1500.0,
              quantity: 1,
              subtotal: 1500.0,
            },
          ],
        },
        guests: {
          create: [
            {
              fullName: 'M6 Guest',
              age: 30,
              idProofType: IdProofType.AADHAAR,
              idProofNumber: '123456789012',
            },
          ],
        },
      },
    });

    // 6. Create a PENDING booking for Tourist 1
    pendingBooking = await prisma.booking.create({
      data: {
        userId: touristUser.id,
        referenceNo: `REF-M6-PEND-${Date.now()}`,
        status: BookingStatus.PENDING,
        totalAmount: 1000.0,
        currency: 'INR',
        items: {
          create: [
            {
              itemType: BookingItemType.GUIDE_SERVICE,
              itemId: guideTargetId,
              unitPrice: 1000.0,
              quantity: 1,
              subtotal: 1000.0,
            },
          ],
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up created records
    if (completedBooking) {
      await prisma.review.deleteMany({ where: { bookingId: completedBooking.id } });
      await prisma.bookingItem.deleteMany({ where: { bookingId: completedBooking.id } });
      await prisma.bookingGuest.deleteMany({ where: { bookingId: completedBooking.id } });
      await prisma.booking.delete({ where: { id: completedBooking.id } });
    }
    if (pendingBooking) {
      await prisma.bookingItem.deleteMany({ where: { bookingId: pendingBooking.id } });
      await prisma.booking.delete({ where: { id: pendingBooking.id } });
    }
    if (touristUser) {
      await prisma.notification.deleteMany({ where: { userId: touristUser.id } });
      await prisma.notificationPreference.deleteMany({ where: { userId: touristUser.id } });
      await prisma.user.delete({ where: { id: touristUser.id } });
    }
    if (anotherTouristUser) {
      await prisma.user.delete({ where: { id: anotherTouristUser.id } });
    }
    if (guideUser) {
      await prisma.user.delete({ where: { id: guideUser.id } });
    }
    await prisma.$disconnect();
  });

  // ── Notifications Endpoints ─────────────────────────────────
  describe('Notifications API', () => {
    it('sends and retrieves notifications for authenticated user', async () => {
      // Dispatch a notification
      await communicationService.sendNotification({
        userId: touristUser.id,
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed!',
        message: 'Your booking has been confirmed successfully.',
        channel: 'IN_APP',
      });

      const res = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${touristToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].type).toBe('BOOKING_CONFIRMED');
    });

    it('marks a single notification as read', async () => {
      const notif = await communicationService.sendNotification({
        userId: touristUser.id,
        type: 'SYSTEM_ALERT',
        title: 'Weather Warning',
        message: 'Heavy rain expected in Betla area.',
      });

      const res = await request(app)
        .patch(`/api/v1/notifications/${notif.id}/read`)
        .set('Authorization', `Bearer ${touristToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.readAt).not.toBeNull();
    });

    it('marks all notifications as read', async () => {
      const res = await request(app)
        .patch('/api/v1/notifications/read-all')
        .set('Authorization', `Bearer ${touristToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('rejects unauthorized notification access without token (401)', async () => {
      const res = await request(app).get('/api/v1/notifications');
      expect(res.status).toBe(401);
    });
  });

  // ── Notification Preferences API ────────────────────────────
  describe('Notification Preferences API', () => {
    it('fetches notification preferences and updates channel settings', async () => {
      const getRes = await request(app)
        .get('/api/v1/notifications/preferences')
        .set('Authorization', `Bearer ${touristToken}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.inAppEnabled).toBe(true);

      const patchRes = await request(app)
        .patch('/api/v1/notifications/preferences')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          emailEnabled: false,
          smsEnabled: false,
        });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.emailEnabled).toBe(false);
      expect(patchRes.body.data.smsEnabled).toBe(false);
      expect(patchRes.body.data.inAppEnabled).toBe(true);
    });
  });

  // ── Reviews API & Eligibility Rules ──────────────────────────
  describe('Reviews API', () => {
    let createdReviewId: string;

    it('rejects review submission for non-completed booking (400)', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          bookingId: pendingBooking.id,
          targetType: 'GUIDE_SERVICE',
          targetId: guideTargetId,
          rating: 4,
          comment: 'Pending booking review attempt',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('BOOKING_NOT_COMPLETED');
    });

    it('rejects review submission when booking belongs to another user (403)', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${anotherTouristToken}`)
        .send({
          bookingId: completedBooking.id,
          targetType: 'GUIDE_SERVICE',
          targetId: guideTargetId,
          rating: 5,
          comment: 'Unauthorized review attempt',
        });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('rejects review submission for target not in booking (400)', async () => {
      const invalidTargetId = '99999999-9999-9999-9999-999999999999';
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          bookingId: completedBooking.id,
          targetType: 'GUIDE_SERVICE',
          targetId: invalidTargetId,
          rating: 5,
          comment: 'Wrong target review attempt',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('TARGET_NOT_IN_BOOKING');
    });

    it('creates an immediately PUBLISHED review for valid COMPLETED booking', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          bookingId: completedBooking.id,
          targetType: 'GUIDE_SERVICE',
          targetId: guideTargetId,
          rating: 5,
          title: 'Outstanding Guide!',
          comment: 'The guide made our Betla trip truly memorable.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PUBLISHED');
      expect(res.body.data.publishedAt).not.toBeNull();
      createdReviewId = res.body.data.id;
    });

    it('rejects duplicate review for the same booking target (409)', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          bookingId: completedBooking.id,
          targetType: 'GUIDE_SERVICE',
          targetId: guideTargetId,
          rating: 4,
          comment: 'Duplicate review attempt',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_REVIEW');
    });

    it('fetches public reviews and user own reviews', async () => {
      const publicRes = await request(app)
        .get('/api/v1/reviews')
        .query({ targetType: 'GUIDE_SERVICE', targetId: guideTargetId });

      expect(publicRes.status).toBe(200);
      expect(publicRes.body.data.length).toBeGreaterThanOrEqual(1);

      const userRes = await request(app)
        .get('/api/v1/reviews/me')
        .set('Authorization', `Bearer ${touristToken}`);

      expect(userRes.status).toBe(200);
      expect(userRes.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('allows guide to post a response to a review', async () => {
      const res = await request(app)
        .post(`/api/v1/reviews/${createdReviewId}/responses`)
        .set('Authorization', `Bearer ${guideToken}`)
        .send({
          responseText: 'Thank you for your kind feedback! Looking forward to hosting you again.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.responseText).toContain('Thank you');
    });

    it('rejects tourist role posting a review response (403)', async () => {
      const res = await request(app)
        .post(`/api/v1/reviews/${createdReviewId}/responses`)
        .set('Authorization', `Bearer ${anotherTouristToken}`)
        .send({
          responseText: 'Unauthorized response attempt',
        });

      expect(res.status).toBe(403);
    });

    it('allows author to update and delete their review', async () => {
      const patchRes = await request(app)
        .patch(`/api/v1/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          title: 'Updated Title',
          comment: 'Updated comment text.',
        });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.title).toBe('Updated Title');

      const delRes = await request(app)
        .delete(`/api/v1/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${touristToken}`);

      expect(delRes.status).toBe(200);
    });
  });
});

// Helper for test tokens
async function generateTestToken(userId: string, role: string): Promise<string> {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-betla-eco-companion-2024-min32chars';
  return jwt.sign({ userId, role, type: 'access' }, secret, { expiresIn: '1h' });
}
