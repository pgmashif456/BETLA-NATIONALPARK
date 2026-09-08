import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/database/client';

describe('Module 5: Eco-Management & Environmental Reporting Integration Tests', () => {
  let touristToken: string;
  let touristId: string;
  let secondTouristToken: string;
  let secondTouristId: string;
  let adminToken: string;
  let adminId: string;
  let forestToken: string;
  let forestId: string;

  let testCategoryId: string;
  let createdReportId: string;
  let createdActivityId: string;

  beforeAll(async () => {
    // Ensure roles exist in DB
    const touristRole = await prisma.role.upsert({
      where: { name: 'TOURIST' },
      update: {},
      create: { name: 'TOURIST', description: 'Tourist' },
    });

    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN', description: 'Admin' },
    });

    const forestRole = await prisma.role.upsert({
      where: { name: 'FOREST_AUTHORITY' },
      update: {},
      create: { name: 'FOREST_AUTHORITY', description: 'Forest Authority' },
    });

    // Create test category
    const category = await prisma.ecoCategory.upsert({
      where: { slug: 'deforestation' },
      update: {},
      create: {
        name: 'Deforestation & Logging',
        slug: 'deforestation',
        description: 'Reports regarding unauthorized wood cutting or forest clearing',
      },
    });
    testCategoryId = category.id;

    // Create Users
    const touristUser = await prisma.user.create({
      data: {
        email: `tourist-m5-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Tourist',
        lastName: 'M5',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: touristRole.id,
      },
    });
    touristId = touristUser.id;

    const secondTouristUser = await prisma.user.create({
      data: {
        email: `tourist2-m5-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'TouristTwo',
        lastName: 'M5',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: touristRole.id,
      },
    });
    secondTouristId = secondTouristUser.id;

    const adminUser = await prisma.user.create({
      data: {
        email: `admin-m5-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Admin',
        lastName: 'M5',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: adminRole.id,
      },
    });
    adminId = adminUser.id;

    const forestUser = await prisma.user.create({
      data: {
        email: `forest-m5-${Date.now()}@example.com`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Forest',
        lastName: 'Officer',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: forestRole.id,
      },
    });
    forestId = forestUser.id;

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

    forestToken = jwt.sign(
      { userId: forestId, email: forestUser.email, role: 'FOREST_AUTHORITY', permissions: ['forest:operations'], type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    if (createdReportId) {
      await prisma.ecoUpdate.deleteMany({ where: { ecoReportId: createdReportId } });
      await prisma.ecoReport.deleteMany({ where: { id: createdReportId } });
    }
    if (createdActivityId) {
      await prisma.ecoActivity.deleteMany({ where: { id: createdActivityId } });
    }
  });

  // 1. Eco Report Creation & Priority Handling
  describe('POST /api/v1/eco/reports', () => {
    it('creates an environmental report with category and priority', async () => {
      const res = await request(app)
        .post('/api/v1/eco/reports')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          categoryId: testCategoryId,
          description: 'Observed non-permitted timber extraction near river bank',
          location: 'Koel River Basin',
          priority: 'HIGH',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('SUBMITTED');
      expect(res.body.data.priority).toBe('HIGH');
      expect(res.body.data.reportedById).toBe(touristId);

      createdReportId = res.body.data.id;
    });

    it('rejects report creation with non-existent category ID', async () => {
      const res = await request(app)
        .post('/api/v1/eco/reports')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          categoryId: '00000000-0000-0000-0000-000000000000',
          description: 'Valid description text here',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ECO_CATEGORY_NOT_FOUND');
    });
  });

  // 2. Report Retrieval & Ownership Access Control
  describe('GET /api/v1/eco/reports and GET /api/v1/eco/reports/:id', () => {
    it('allows reporter to fetch their report by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/eco/reports/${createdReportId}`)
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdReportId);
    });

    it('rejects unauthorized user viewing another user restricted report (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/eco/reports/${createdReportId}`)
        .set('Authorization', `Bearer ${secondTouristToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED_ECO_ACCESS');
    });

    it('allows Admin to view any report', async () => {
      const res = await request(app)
        .get(`/api/v1/eco/reports/${createdReportId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('allows Forest Authority to view any report', async () => {
      const res = await request(app)
        .get(`/api/v1/eco/reports/${createdReportId}`)
        .set('Authorization', `Bearer ${forestToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  // 3. Report Assignment & Linear State Machine Status Transitions
  describe('PATCH /api/v1/eco/reports/:id/status and /assign', () => {
    it('allows Admin to transition status from SUBMITTED to REVIEWED', async () => {
      const res = await request(app)
        .patch(`/api/v1/eco/reports/${createdReportId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'REVIEWED',
          notes: 'Report verified by administrative staff',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('REVIEWED');
    });

    it('assigns report to Forest Officer and transitions status to ASSIGNED', async () => {
      const res = await request(app)
        .patch(`/api/v1/eco/reports/${createdReportId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          assignedToId: forestId,
          notes: 'Assigning to Forest Officer for ground verification',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.assignedToId).toBe(forestId);
      expect(res.body.data.status).toBe('ASSIGNED');
    });

    it('rejects invalid out-of-order transition (ASSIGNED -> CLOSED directly)', async () => {
      const res = await request(app)
        .patch(`/api/v1/eco/reports/${createdReportId}/status`)
        .set('Authorization', `Bearer ${forestToken}`)
        .send({
          status: 'CLOSED',
          notes: 'Attempting invalid jump to CLOSED',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('allows Forest Officer to transition status to IN_PROGRESS', async () => {
      const res = await request(app)
        .patch(`/api/v1/eco/reports/${createdReportId}/status`)
        .set('Authorization', `Bearer ${forestToken}`)
        .send({
          status: 'IN_PROGRESS',
          notes: 'Field patrol team dispatched',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('allows transition from IN_PROGRESS to RESOLVED', async () => {
      const res = await request(app)
        .patch(`/api/v1/eco/reports/${createdReportId}/status`)
        .set('Authorization', `Bearer ${forestToken}`)
        .send({
          status: 'RESOLVED',
          notes: 'Action completed and site secured',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('RESOLVED');
      expect(res.body.data.resolvedAt).toBeDefined();
    });

    it('allows transition from RESOLVED to CLOSED', async () => {
      const res = await request(app)
        .patch(`/api/v1/eco/reports/${createdReportId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'CLOSED',
          notes: 'Case archived and closed',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('CLOSED');
    });
  });

  // 4. Eco Activities API
  describe('Eco Activities Endpoints', () => {
    it('allows Admin to create an Eco Activity', async () => {
      const res = await request(app)
        .post('/api/v1/eco/activities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Wildlife Habitat Cleanup',
          description: 'Community volunteer plastic cleanup near forest perimeter',
          activityDate: '2026-11-01T10:00:00.000Z',
          location: 'Betla Park Entry Gate',
          organizer: 'Betla Eco Club',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Wildlife Habitat Cleanup');

      createdActivityId = res.body.data.id;
    });

    it('allows public/authenticated users to fetch Eco Activities', async () => {
      const res = await request(app)
        .get('/api/v1/eco/activities')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('allows Forest Authority to update an Eco Activity', async () => {
      const res = await request(app)
        .put(`/api/v1/eco/activities/${createdActivityId}`)
        .set('Authorization', `Bearer ${forestToken}`)
        .send({
          location: 'Betla Main Gate & Visitor Center',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.location).toBe('Betla Main Gate & Visitor Center');
    });

    it('rejects unauthorized Tourist creating an Eco Activity (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/eco/activities')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          title: 'Unauthorized Event',
          description: 'Should be rejected',
          activityDate: '2026-11-01T10:00:00.000Z',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  // 5. M1, M2, M3, M4 Regressions
  describe('M1, M2, M3, M4 Regression Verification', () => {
    it('M1 Regression: Health live check OK', async () => {
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
  });
});
