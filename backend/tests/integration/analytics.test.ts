import request from 'supertest';
import app from '../../src/app';
import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

describe('Module 7 Integration Tests: Analytics & Reporting API', () => {
  let adminToken: string;
  let adminUser: any;
  let forestToken: string;
  let forestUser: any;
  let touristToken: string;
  let touristUser: any;

  beforeAll(async () => {
    // Get roles
    const adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } });
    const forestRole = await prisma.role.findUnique({ where: { name: RoleName.FOREST_AUTHORITY } });
    const touristRole = await prisma.role.findUnique({ where: { name: RoleName.TOURIST } });

    // 1. Create Admin User
    adminUser = await prisma.user.create({
      data: {
        email: `m7_admin_${Date.now()}@example.com`,
        passwordHash: '$2b$10$hashedpasswordplaceholder',
        firstName: 'M7Admin',
        lastName: 'User',
        emailVerified: true,
        roleId: adminRole!.id,
      },
    });
    adminToken = generateTestToken(adminUser.id, 'ADMIN');

    // 2. Create Forest Authority User
    forestUser = await prisma.user.create({
      data: {
        email: `m7_forest_${Date.now()}@example.com`,
        passwordHash: '$2b$10$hashedpasswordplaceholder',
        firstName: 'M7Forest',
        lastName: 'User',
        emailVerified: true,
        roleId: forestRole!.id,
      },
    });
    forestToken = generateTestToken(forestUser.id, 'FOREST_AUTHORITY');

    // 3. Create Tourist User
    touristUser = await prisma.user.create({
      data: {
        email: `m7_tourist_${Date.now()}@example.com`,
        passwordHash: '$2b$10$hashedpasswordplaceholder',
        firstName: 'M7Tourist',
        lastName: 'User',
        emailVerified: true,
        roleId: touristRole!.id,
      },
    });
    touristToken = generateTestToken(touristUser.id, 'TOURIST');
  });

  afterAll(async () => {
    if (adminUser) await prisma.user.delete({ where: { id: adminUser.id } });
    if (forestUser) await prisma.user.delete({ where: { id: forestUser.id } });
    if (touristUser) await prisma.user.delete({ where: { id: touristUser.id } });
    await prisma.$disconnect();
  });

  describe('ADMIN Role Analytics Access', () => {
    it('GET /api/v1/analytics/overview returns 200 for ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overview).toHaveProperty('totalUsers');
      expect(res.body.data.overview).toHaveProperty('totalRevenue');
    });

    it('GET /api/v1/analytics/tourism returns 200 for ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/tourism')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('destinations');
      expect(res.body.data).toHaveProperty('attractions');
    });

    it('GET /api/v1/analytics/bookings returns 200 for ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/bookings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('bookings');
      expect(res.body.data).toHaveProperty('revenue');
    });

    it('GET /api/v1/analytics/safety returns 200 for ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/safety')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('incidents');
      expect(res.body.data).toHaveProperty('safetyAlerts');
    });

    it('GET /api/v1/analytics/eco returns 200 for ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/eco')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('ecoReports');
      expect(res.body.data).toHaveProperty('ecoActivities');
    });

    it('GET /api/v1/analytics/users returns 200 for ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('profiles');
    });
  });

  describe('FOREST_AUTHORITY Role Analytics Access', () => {
    it('allows FOREST_AUTHORITY role to fetch analytics overview', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${forestToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('allows FOREST_AUTHORITY role to fetch eco analytics', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/eco')
        .set('Authorization', `Bearer ${forestToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Role-Based Authorization Restrictions', () => {
    it('rejects TOURIST role with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${touristToken}`);

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated request with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/analytics/overview');
      expect(res.status).toBe(401);
    });
  });
});

// Helper for test tokens
function generateTestToken(userId: string, role: string): string {
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-betla-eco-companion-2024-min32chars';
  return jwt.sign({ userId, role, type: 'access' }, secret, { expiresIn: '1h' });
}
