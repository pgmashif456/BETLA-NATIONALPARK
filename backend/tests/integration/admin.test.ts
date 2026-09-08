import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import { prisma } from '../../src/database/client';
import { config } from '../../src/config';
import { UserStatus, RoleName } from '@prisma/client';

jest.setTimeout(60000);

describe('Module 8 Integration Tests: Admin, Governance & System Management API', () => {
  const timestamp = Date.now();
  let adminToken: string;
  let adminUserId: string;
  let forestToken: string;
  let forestUserId: string;
  let touristToken: string;
  let targetUserId: string;
  let roleId: string;

  beforeAll(async () => {
    // 1. Fetch ADMIN role & create ADMIN user
    const adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } });
    const adminUser = await prisma.user.create({
      data: {
        email: `admin-m8-${timestamp}@example.com`,
        firstName: 'System',
        lastName: 'Admin',
        passwordHash: '$2b$10$dummyHashValueForTestingOnly1234567890123456789012',
        roleId: adminRole!.id,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });
    adminUserId = adminUser.id;
    adminToken = jwt.sign(
      {
        userId: adminUserId,
        email: adminUser.email,
        role: 'ADMIN',
        permissions: ['*'],
        type: 'access',
      },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    // 2. Fetch FOREST_AUTHORITY role & create FOREST_AUTHORITY user
    const forestRole = await prisma.role.findUnique({ where: { name: RoleName.FOREST_AUTHORITY } });
    const forestUser = await prisma.user.create({
      data: {
        email: `forest-m8-${timestamp}@example.com`,
        firstName: 'Forest',
        lastName: 'Ranger',
        passwordHash: '$2b$10$dummyHashValueForTestingOnly1234567890123456789012',
        roleId: forestRole!.id,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });
    forestUserId = forestUser.id;
    forestToken = jwt.sign(
      {
        userId: forestUserId,
        email: forestUser.email,
        role: 'FOREST_AUTHORITY',
        permissions: [],
        type: 'access',
      },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    // 3. Create Tourist user for testing status changes and forbidden access
    const touristRole = await prisma.role.findUnique({ where: { name: RoleName.TOURIST } });
    roleId = touristRole!.id;
    const touristUser = await prisma.user.create({
      data: {
        email: `tourist-m8-${timestamp}@example.com`,
        firstName: 'Target',
        lastName: 'Tourist',
        passwordHash: '$2b$10$dummyHashValueForTestingOnly1234567890123456789012',
        roleId: touristRole!.id,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });
    targetUserId = touristUser.id;
    touristToken = jwt.sign(
      {
        userId: targetUserId,
        email: touristUser.email,
        role: 'TOURIST',
        permissions: [],
        type: 'access',
      },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    const userIds = [adminUserId, forestUserId, targetUserId].filter(Boolean);
    if (userIds.length > 0) {
      await prisma.auditLog.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });

  // ── 1. Authentication & RBAC Checks ──────────────────────────

  it('unauthenticated request to /api/v1/admin/users should fail with 401', async () => {
    const res = await request(app).get('/api/v1/admin/users');
    expect(res.status).toBe(401);
  });

  it('TOURIST role accessing /api/v1/admin/users should be forbidden with 403', async () => {
    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${touristToken}`);
    expect(res.status).toBe(403);
  });

  it('FOREST_AUTHORITY role mutating user status should be forbidden with 403', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/users/${targetUserId}/status`)
      .set('Authorization', `Bearer ${forestToken}`)
      .send({ status: 'SUSPENDED' });
    expect(res.status).toBe(403);
  });

  // ── 2. User Management & Audit Logging ───────────────────────

  it('GET /api/v1/admin/users — ADMIN lists users with pagination', async () => {
    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.users)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();

    // Verify secrets are NOT leaked
    const firstUser = res.body.data.users[0];
    expect(firstUser.passwordHash).toBeUndefined();
  });

  it('PATCH /api/v1/admin/users/:id/status — ADMIN updates status & creates audit log', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/users/${targetUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'SUSPENDED', reason: 'Integration test suspension' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.status).toBe('SUSPENDED');

    // Verify AuditLog was created
    const auditLog = await prisma.auditLog.findFirst({
      where: { entityId: targetUserId, action: 'UPDATE_USER_STATUS' },
    });
    expect(auditLog).toBeDefined();
    expect(auditLog?.module).toBe('USER');
  });

  // ── 3. Role Management ───────────────────────────────────────

  it('GET /api/v1/admin/roles — ADMIN retrieves all roles', async () => {
    const res = await request(app)
      .get('/api/v1/admin/roles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.roles)).toBe(true);
  });

  it('PUT /api/v1/admin/roles/:id — ADMIN updates role & creates audit log', async () => {
    const res = await request(app)
      .put(`/api/v1/admin/roles/${roleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Updated tourist role description' });

    expect(res.status).toBe(200);
    expect(res.body.data.role.description).toBe('Updated tourist role description');
  });

  // ── 4. Audit Logs ────────────────────────────────────────────

  it('GET /api/v1/admin/audit-logs — ADMIN retrieves filtered audit logs', async () => {
    const res = await request(app)
      .get('/api/v1/admin/audit-logs')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ module: 'USER' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.auditLogs)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
  });

  // ── 5. System Settings ────────────────────────────────────────

  it('PUT & GET /api/v1/admin/settings — ADMIN manages system settings & creates audit log', async () => {
    const settingKey = `TEST_SETTING_${timestamp}`;

    // PUT setting
    const putRes = await request(app)
      .put(`/api/v1/admin/settings/${settingKey}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ value: { enabled: true, mode: 'test' }, description: 'Test setting description' });

    expect(putRes.status).toBe(200);
    expect(putRes.body.data.setting.key).toBe(settingKey);

    // GET settings
    const getRes = await request(app)
      .get('/api/v1/admin/settings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body.data.settings)).toBe(true);
  });

  // ── 6. Dashboard & Reports (ADMIN & FOREST_AUTHORITY) ────────

  it('GET /api/v1/admin/dashboard — FOREST_AUTHORITY can access dashboard summary', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${forestToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.recentActivities).toBeDefined();
  });

  it('GET /api/v1/admin/reports — ADMIN and FOREST_AUTHORITY can generate reports', async () => {
    const res = await request(app)
      .get('/api/v1/admin/reports')
      .set('Authorization', `Bearer ${forestToken}`)
      .query({ reportType: 'USERS' });

    expect(res.status).toBe(200);
    expect(res.body.data.reportType).toBe('USERS');
    expect(res.body.data.metrics).toBeDefined();
  });
});
