import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/database/client';

describe('Module 4: Safety, Emergency & Incident Management Integration Tests', () => {
  let touristToken: string;
  let touristId: string;
  let adminToken: string;
  let adminId: string;
  let secondTouristToken: string;
  let secondTouristId: string;

  let createdIncidentId: string;
  let emergencyIncidentId: string;

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

    // Create test user 1 (Tourist)
    const touristEmail = `tourist-m4-${Date.now()}@example.com`;
    const touristUser = await prisma.user.create({
      data: {
        email: touristEmail,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Tourist',
        lastName: 'M4',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: touristRole.id,
      },
    });
    touristId = touristUser.id;

    // Create test user 2 (Admin)
    const adminEmail = `admin-m4-${Date.now()}@example.com`;
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'Admin',
        lastName: 'M4',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: adminRole.id,
      },
    });
    adminId = adminUser.id;

    // Create test user 3 (Second Tourist)
    const secondEmail = `tourist2-m4-${Date.now()}@example.com`;
    const secondUser = await prisma.user.create({
      data: {
        email: secondEmail,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhash',
        firstName: 'TouristTwo',
        lastName: 'M4',
        status: 'ACTIVE',
        emailVerified: true,
        roleId: touristRole.id,
      },
    });
    secondTouristId = secondUser.id;

    // Generate JWT tokens using AuthService logic or helper
    const jwt = require('jsonwebtoken');
    const { config } = require('../../src/config');

    touristToken = jwt.sign(
      { userId: touristId, email: touristEmail, role: 'TOURIST', permissions: [], type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { userId: adminId, email: adminEmail, role: 'ADMIN', permissions: ['admin:dashboard', 'destinations:update'], type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    secondTouristToken = jwt.sign(
      { userId: secondTouristId, email: secondEmail, role: 'TOURIST', permissions: [], type: 'access' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Cleanup generated incidents and updates
    if (createdIncidentId || emergencyIncidentId) {
      await prisma.incidentUpdate.deleteMany({
        where: { incidentId: { in: [createdIncidentId, emergencyIncidentId].filter(Boolean) } },
      });
      await prisma.incident.deleteMany({
        where: { id: { in: [createdIncidentId, emergencyIncidentId].filter(Boolean) } },
      });
    }
  });

  // 1. Emergency Creation & Priority Handling
  describe('POST /api/v1/safety/emergency', () => {
    it('creates an emergency request with CRITICAL priority', async () => {
      const res = await request(app)
        .post('/api/v1/safety/emergency')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          type: 'Wildlife Emergency',
          description: 'Encountered wild elephant near north gate',
          location: 'Betla North Zone',
          latitude: 23.8821,
          longitude: 84.1923,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.priority).toBe('CRITICAL');
      expect(res.body.data.status).toBe('REPORTED');
      expect(res.body.data.reportedById).toBe(touristId);

      emergencyIncidentId = res.body.data.id;
    });
  });

  // 2. Incident Creation & Unique Identifier
  describe('POST /api/v1/incidents', () => {
    it('creates a standard incident with unique identifier', async () => {
      const res = await request(app)
        .post('/api/v1/incidents')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          type: 'Lost Item',
          description: 'Lost backpack near watchtower',
          location: 'Betla Watchtower',
          priority: 'MEDIUM',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.priority).toBe('MEDIUM');
      expect(res.body.data.status).toBe('REPORTED');

      createdIncidentId = res.body.data.id;
      expect(createdIncidentId).not.toEqual(emergencyIncidentId);
    });
  });

  // 3. Incident Retrieval & Access Control
  describe('GET /api/v1/incidents and GET /api/v1/incidents/:id', () => {
    it('allows reporter to fetch their incident by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/incidents/${createdIncidentId}`)
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdIncidentId);
    });

    it('rejects unauthorized user viewing another user restricted incident (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/incidents/${createdIncidentId}`)
        .set('Authorization', `Bearer ${secondTouristToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED_INCIDENT_ACCESS');
    });

    it('allows Admin to fetch any incident', async () => {
      const res = await request(app)
        .get(`/api/v1/incidents/${createdIncidentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdIncidentId);
    });

    it('returns filtered list of incidents for user', async () => {
      const res = await request(app)
        .get('/api/v1/incidents')
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  // 4. Incident Assignment & Status Transition Enforcement
  describe('PATCH /api/v1/incidents/:id/assign and PATCH /api/v1/incidents/:id/status', () => {
    it('assigns incident to admin and transitions status to ASSIGNED', async () => {
      const res = await request(app)
        .patch(`/api/v1/incidents/${createdIncidentId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          assignedToId: adminId,
          notes: 'Assigning to Admin M4 for resolution',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.assignedToId).toBe(adminId);
      expect(res.body.data.status).toBe('ASSIGNED');
    });

    it('allows status transition from ASSIGNED to IN_PROGRESS', async () => {
      const res = await request(app)
        .patch(`/api/v1/incidents/${createdIncidentId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'IN_PROGRESS',
          notes: 'Investigation underway',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('rejects invalid CANCELLED transition from IN_PROGRESS state', async () => {
      const res = await request(app)
        .patch(`/api/v1/incidents/${createdIncidentId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'CANCELLED',
          notes: 'Attempting invalid cancellation',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });

    it('allows status transition from IN_PROGRESS to RESOLVED', async () => {
      const res = await request(app)
        .patch(`/api/v1/incidents/${createdIncidentId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'RESOLVED',
          notes: 'Item found and returned',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('RESOLVED');
      expect(res.body.data.resolvedAt).toBeDefined();
    });

    it('allows exceptional transition REPORTED -> CANCELLED for fresh emergency', async () => {
      const freshRes = await request(app)
        .post('/api/v1/incidents')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          type: 'False Alarm',
          description: 'Accidental report',
        })
        .expect(201);

      const cancelRes = await request(app)
        .patch(`/api/v1/incidents/${freshRes.body.data.id}/status`)
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          status: 'CANCELLED',
          notes: 'Cancelling false alarm',
        })
        .expect(200);

      expect(cancelRes.body.success).toBe(true);
      expect(cancelRes.body.data.status).toBe('CANCELLED');
    });
  });

  // 5. Incident Updates Log
  describe('POST /api/v1/incidents/:id/update', () => {
    it('appends an update log entry to the incident', async () => {
      const res = await request(app)
        .post(`/api/v1/incidents/${createdIncidentId}/update`)
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          notes: 'Tourist verified lost item recovery',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.notes).toBe('Tourist verified lost item recovery');
    });
  });

  // 6. Safety Alerts
  describe('Safety Alerts API', () => {
    it('allows Admin to issue a Safety Alert', async () => {
      const res = await request(app)
        .post('/api/v1/safety/alerts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Heavy Rain Warning',
          message: 'Heavy rainfall expected in West zone. Safaris delayed.',
          severity: 'WARNING',
          area: 'West Zone',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Heavy Rain Warning');
    });

    it('allows public users to fetch active safety alerts', async () => {
      const res = await request(app)
        .get('/api/v1/safety/alerts')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('rejects unauthorized non-admin user creating safety alert', async () => {
      const res = await request(app)
        .post('/api/v1/safety/alerts')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          title: 'Unauthorized Alert',
          message: 'Should be rejected',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  // 7. Authentication Protection
  describe('Authentication & Protected Route Checks', () => {
    it('rejects request to protected incident endpoint without token (401)', async () => {
      const res = await request(app)
        .get('/api/v1/incidents')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  // 8. Regression Checks (M1, M2, M3)
  describe('M1, M2, M3 Regression Tests', () => {
    it('M1 Auth: Health check responds OK', async () => {
      const res = await request(app).get('/health/live').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('alive');
    });

    it('M3 Content: Categories fetch responds OK', async () => {
      const res = await request(app).get('/api/v1/categories').expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
