import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import { prisma } from '../../src/database/client';
import { config } from '../../src/config';
import { ContentStatus } from '@prisma/client';

jest.setTimeout(60000);

describe('Module 3 Integration Tests: Content & Discovery API', () => {
  const timestamp = Date.now();
  let adminToken: string;
  let adminUserId: string;
  let touristToken: string;

  let categoryId: string;
  let testDestinationId: string;
  let draftDestinationId: string;
  let unpublishedDestinationId: string;
  let archivedDestinationId: string;

  beforeAll(async () => {
    // 1. Fetch or create ADMIN role & user
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    
    const adminUser = await prisma.user.create({
      data: {
        email: `admin-${timestamp}@example.com`,
        firstName: 'Content',
        lastName: 'Admin',
        passwordHash: '$2b$10$dummyHashValueForTestingOnly1234567890123456789012',
        roleId: adminRole!.id,
        status: 'ACTIVE',
        emailVerified: true,
      },
    });
    adminUserId = adminUser.id;

    // Generate JWT admin access token with permissions
    const adminPermissions = [
      'destinations:read',
      'destinations:create',
      'destinations:update',
      'destinations:delete',
    ];
    adminToken = jwt.sign(
      {
        userId: adminUserId,
        email: adminUser.email,
        role: 'ADMIN',
        permissions: adminPermissions,
        type: 'access',
      },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    // 2. Create & verify Tourist user
    const touristRes = await request(app).post('/api/v1/auth/register').send({
      email: `m3tourist-${timestamp}@example.com`,
      password: 'Password123!',
      firstName: 'Content',
      lastName: 'Tourist',
      role: 'TOURIST',
    });
    const touristVerifyToken = touristRes.body.data.verificationToken;
    await request(app).post('/api/v1/auth/verify').send({ token: touristVerifyToken });
    const touristLogin = await request(app).post('/api/v1/auth/login').send({
      email: `m3tourist-${timestamp}@example.com`,
      password: 'Password123!',
    });
    touristToken = touristLogin.body.data.tokens.accessToken;

    // 3. Fetch or create Category
    const category = await prisma.category.upsert({
      where: { slug: 'wildlife' },
      update: {},
      create: { name: 'Wildlife', slug: 'wildlife', description: 'Wildlife & Safari' },
    });
    categoryId = category.id;

    // 4. Seed test destinations with different statuses
    const publishedDest = await prisma.destination.create({
      data: {
        name: `Betla Fort Test ${timestamp}`,
        slug: `betla-fort-test-${timestamp}`,
        shortDescription: 'Historic fort inside tiger reserve',
        description: 'Detailed description of Betla Fort',
        location: 'Palamau Reserve',
        latitude: 23.8872,
        longitude: 84.1913,
        status: ContentStatus.PUBLISHED,
        isFeatured: true,
      },
    });
    testDestinationId = publishedDest.id;

    const draftDest = await prisma.destination.create({
      data: {
        name: `Draft Destination Test ${timestamp}`,
        slug: `draft-dest-test-${timestamp}`,
        status: ContentStatus.DRAFT,
      },
    });
    draftDestinationId = draftDest.id;

    const unpubDest = await prisma.destination.create({
      data: {
        name: `Unpublished Destination Test ${timestamp}`,
        slug: `unpub-dest-test-${timestamp}`,
        status: ContentStatus.UNPUBLISHED,
      },
    });
    unpublishedDestinationId = unpubDest.id;

    const archDest = await prisma.destination.create({
      data: {
        name: `Archived Destination Test ${timestamp}`,
        slug: `arch-dest-test-${timestamp}`,
        status: ContentStatus.ARCHIVED,
      },
    });
    archivedDestinationId = archDest.id;
  });

  afterAll(async () => {
    const idsToDelete = [
      testDestinationId,
      draftDestinationId,
      unpublishedDestinationId,
      archivedDestinationId,
    ].filter(Boolean);

    if (idsToDelete.length > 0) {
      await prisma.destination.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    if (adminUserId) {
      await prisma.user.deleteMany({
        where: { id: adminUserId },
      });
    }
  });

  // ── 1. Categories & General Discovery ─────────────────────────

  it('GET /api/v1/categories — should retrieve all categories', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/discover — should return aggregated published data', async () => {
    const res = await request(app).get('/api/v1/discover');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.destinations).toBeDefined();
    expect(res.body.data.categories).toBeDefined();

    // Verify non-published destinations are NOT included in public discovery
    const destIds = res.body.data.destinations.map((d: any) => d.id);
    expect(destIds).toContain(testDestinationId);
    expect(destIds).not.toContain(draftDestinationId);
    expect(destIds).not.toContain(unpublishedDestinationId);
    expect(destIds).not.toContain(archivedDestinationId);
  });

  // ── 2. Destination Endpoints & Status Isolation ────────────────

  it('GET /api/v1/destinations — public request returns PUBLISHED items only', async () => {
    const res = await request(app).get('/api/v1/destinations');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const statuses = res.body.data.map((d: any) => d.status);
    expect(statuses.every((s: string) => s === 'PUBLISHED')).toBe(true);
  });

  it('GET /api/v1/destinations?status=ALL — management request loads all destinations across all statuses', async () => {
    const resMgmt = await request(app)
      .get('/api/v1/destinations?status=ALL')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resMgmt.status).toBe(200);
    const destIds = resMgmt.body.data.map((d: any) => d.id);
    expect(destIds).toContain(testDestinationId);
    expect(destIds).toContain(draftDestinationId);
    expect(destIds).toContain(archivedDestinationId);
  });

  it('GET /api/v1/destinations?status=ALL — management request with status=ALL does not throw 500 error', async () => {
    const resAll = await request(app)
      .get('/api/v1/destinations?status=ALL')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resAll.status).toBe(200);
    const destIds = resAll.body.data.map((d: any) => d.id);
    expect(destIds).toContain(testDestinationId);
    expect(destIds).toContain(draftDestinationId);
    expect(destIds).toContain(archivedDestinationId);
  });

  it('GET /api/v1/destinations?status=PUBLISHED — management request with status filter works correctly', async () => {
    const resPub = await request(app)
      .get('/api/v1/destinations?status=PUBLISHED')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resPub.status).toBe(200);
    const statuses = resPub.body.data.map((d: any) => d.status);
    expect(statuses.every((s: string) => s === 'PUBLISHED')).toBe(true);
  });

  it('GET /api/v1/destinations/:id — should return PUBLISHED destination details', async () => {
    const res = await request(app).get(`/api/v1/destinations/${testDestinationId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(testDestinationId);
    expect(res.body.data.name).toContain('Betla Fort Test');
  });

  it('GET /api/v1/destinations/:id — public request for DRAFT/UNPUBLISHED/ARCHIVED content returns 404', async () => {
    const resDraft = await request(app).get(`/api/v1/destinations/${draftDestinationId}`);
    expect(resDraft.status).toBe(404);

    const resUnpub = await request(app).get(`/api/v1/destinations/${unpublishedDestinationId}`);
    expect(resUnpub.status).toBe(404);

    const resArch = await request(app).get(`/api/v1/destinations/${archivedDestinationId}`);
    expect(resArch.status).toBe(404);
  });

  it('GET /api/v1/destinations/nearby — should calculate nearby destinations sorted by distance', async () => {
    const res = await request(app)
      .get('/api/v1/destinations/nearby')
      .query({ lat: 23.88, lng: 84.19, radiusKm: 50 });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].distanceKm).toBeDefined();
    }
  });

  // ── 3. Destination CRUD & Authorization ───────────────────────

  it('POST /api/v1/destinations — unauthorized request without token should fail with 401', async () => {
    const res = await request(app)
      .post('/api/v1/destinations')
      .send({ name: 'Unauthorized Dest' });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/destinations — TOURIST role should be forbidden with 403', async () => {
    const res = await request(app)
      .post('/api/v1/destinations')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ name: 'Tourist Dest' });
    expect(res.status).toBe(403);
  });

  it('POST /api/v1/destinations — ADMIN role creates destination successfully', async () => {
    const res = await request(app)
      .post('/api/v1/destinations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Created Dest Test ${timestamp}`,
        slug: `created-dest-test-${timestamp}`,
        shortDescription: 'Created via admin integration test',
        status: 'PUBLISHED',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe(`Created Dest Test ${timestamp}`);
    expect(res.body.data.status).toBe('PUBLISHED');
  });

  it('PATCH /api/v1/destinations/:id — ADMIN role updates destination', async () => {
    const res = await request(app)
      .patch(`/api/v1/destinations/${testDestinationId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        shortDescription: 'Updated short description via patch',
        isFeatured: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.shortDescription).toBe('Updated short description via patch');
  });

  it('DELETE /api/v1/destinations/:id — ADMIN role deletes destination', async () => {
    const tempDest = await prisma.destination.create({
      data: { name: `Temp Delete Dest ${timestamp}`, slug: `temp-delete-dest-${timestamp}` },
    });

    const res = await request(app)
      .delete(`/api/v1/destinations/${tempDest.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.message).toContain('deleted');
  });

  // ── 4. Attractions CRUD ───────────────────────────────────────

  it('POST /api/v1/attractions & GET /api/v1/attractions — Attraction lifecycle', async () => {
    // Create Attraction
    const createRes = await request(app)
      .post('/api/v1/attractions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        destinationId: testDestinationId,
        categoryId: categoryId,
        name: 'Kechki Sangam',
        description: 'Confluence of North Koel and Auranga rivers',
        openingTime: '06:00 AM',
        closingTime: '06:00 PM',
        status: 'PUBLISHED',
      });

    expect(createRes.status).toBe(201);
    const attractionId = createRes.body.data.id;

    // Get Attraction by ID
    const getRes = await request(app).get(`/api/v1/attractions/${attractionId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.name).toBe('Kechki Sangam');

    // Update Attraction
    const patchRes = await request(app)
      .patch(`/api/v1/attractions/${attractionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ location: 'Near Kechki River Bank' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.location).toBe('Near Kechki River Bank');
  });

  // ── 5. Experiences CRUD ───────────────────────────────────────

  it('POST /api/v1/experiences & GET /api/v1/experiences — Experience lifecycle', async () => {
    // Create Experience
    const createRes = await request(app)
      .post('/api/v1/experiences')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        destinationId: testDestinationId,
        categoryId: categoryId,
        name: 'Morning Elephant Safari',
        description: 'Guided morning jungle safari on elephant back',
        duration: '2 Hours',
        difficulty: 'EASY',
        status: 'PUBLISHED',
      });

    expect(createRes.status).toBe(201);
    const experienceId = createRes.body.data.id;

    // Get Experience by ID
    const getRes = await request(app).get(`/api/v1/experiences/${experienceId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.name).toBe('Morning Elephant Safari');
  });

  // ── 6. Activities CRUD ────────────────────────────────────────

  it('POST /api/v1/activities & GET /api/v1/activities — Activity lifecycle', async () => {
    // Create Activity
    const createRes = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        destinationId: testDestinationId,
        categoryId: categoryId,
        name: 'Jungle Trekking',
        description: 'Guided nature walk through core forest trail',
        duration: '3 Hours',
        status: 'PUBLISHED',
      });

    expect(createRes.status).toBe(201);
    const activityId = createRes.body.data.id;

    // Get Activity by ID
    const getRes = await request(app).get(`/api/v1/activities/${activityId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.name).toBe('Jungle Trekking');
  });

  // ── 7. Error Handling & Payload Validation ────────────────────

  it('POST /api/v1/destinations — invalid payload returns 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/destinations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '' }); // empty name fails validation

    expect(res.status).toBe(400);
  });

  it('GET /api/v1/destinations/:id — non-existent UUID returns 404', async () => {
    const res = await request(app).get('/api/v1/destinations/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});
