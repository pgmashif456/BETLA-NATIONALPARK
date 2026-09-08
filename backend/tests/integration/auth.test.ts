import request from 'supertest';
import app from '../../src/app';

// ───────────────────────────────────────────────────────────────
// Integration tests for Auth API
// These tests require a running database connection.
// Run with: npm run test:integration
// ───────────────────────────────────────────────────────────────

const API = '/api/v1/auth';

const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestP@ss1!',
  firstName: 'Test',
  lastName: 'User',
  role: 'TOURIST',
};

let verificationToken: string;
let accessToken: string;
let refreshToken: string;

describe('Auth API Integration Tests', () => {
  // ── Registration ────────────────────────────────────────────

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post(`${API}/register`)
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.firstName).toBe(testUser.firstName);
      expect(res.body.data.user.status).toBe('PENDING_VERIFICATION');
      expect(res.body.data.user.role.name).toBe('TOURIST');

      // Password must never be returned
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.user.password).toBeUndefined();

      // Store verification token for later
      verificationToken = res.body.data.verificationToken;
      expect(verificationToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post(`${API}/register`)
        .send(testUser)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post(`${API}/register`)
        .send({ ...testUser, email: 'invalid' })
        .expect(422);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post(`${API}/register`)
        .send({ ...testUser, email: 'weak@example.com', password: '123' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should reject ADMIN role registration', async () => {
      const res = await request(app)
        .post(`${API}/register`)
        .send({ ...testUser, email: 'admin@example.com', role: 'ADMIN' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post(`${API}/register`)
        .send({ email: 'partial@example.com' })
        .expect(422);

      expect(res.body.success).toBe(false);
    });
  });

  // ── Login (before verification) ─────────────────────────────

  describe('POST /auth/login (before verification)', () => {
    it('should reject login for unverified account', async () => {
      const res = await request(app)
        .post(`${API}/login`)
        .send({ email: testUser.email, password: testUser.password })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ACCOUNT_NOT_VERIFIED');
    });
  });

  // ── Email Verification ──────────────────────────────────────

  describe('POST /auth/verify', () => {
    it('should reject invalid verification token', async () => {
      const res = await request(app)
        .post(`${API}/verify`)
        .send({ token: 'invalid-token' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should verify email with valid token', async () => {
      const res = await request(app)
        .post(`${API}/verify`)
        .send({ token: verificationToken })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toContain('verified');
    });

    it('should reject already verified email', async () => {
      const res = await request(app)
        .post(`${API}/verify`)
        .send({ token: verificationToken })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  // ── Login (after verification) ──────────────────────────────

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post(`${API}/login`)
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.status).toBe('ACTIVE');
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();

      // Password must never be returned
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.user.password).toBeUndefined();

      accessToken = res.body.data.tokens.accessToken;
      refreshToken = res.body.data.tokens.refreshToken;
    });

    it('should reject invalid password (generic error)', async () => {
      const res = await request(app)
        .post(`${API}/login`)
        .send({ email: testUser.email, password: 'WrongPassword1!' })
        .expect(401);

      expect(res.body.success).toBe(false);
      // Should NOT reveal whether email exists — generic message
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject non-existent email (generic error)', async () => {
      const res = await request(app)
        .post(`${API}/login`)
        .send({ email: 'nonexistent@example.com', password: 'AnyP@ss1!' })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  // ── Get Current User ────────────────────────────────────────

  describe('GET /auth/me', () => {
    it('should return current user when authenticated', async () => {
      const res = await request(app)
        .get(`${API}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.permissions).toBeDefined();
      expect(Array.isArray(res.body.data.user.permissions)).toBe(true);

      // Password must never be returned
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app)
        .get(`${API}/me`)
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get(`${API}/me`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  // ── Token Refresh ───────────────────────────────────────────

  describe('POST /auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const res = await request(app)
        .post(`${API}/refresh`)
        .send({ refreshToken })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();

      // Update tokens for subsequent tests
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should reject invalid refresh token', async () => {
      const res = await request(app)
        .post(`${API}/refresh`)
        .send({ refreshToken: 'invalid-refresh-token' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  // ── Change Password ─────────────────────────────────────────

  describe('POST /auth/change-password', () => {
    const newPassword = 'NewTestP@ss2!';

    it('should reject wrong current password', async () => {
      const res = await request(app)
        .post(`${API}/change-password`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ currentPassword: 'WrongP@ss1!', newPassword })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PASSWORD_MISMATCH');
    });

    it('should reject same password', async () => {
      const res = await request(app)
        .post(`${API}/change-password`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ currentPassword: testUser.password, newPassword: testUser.password })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('SAME_PASSWORD');
    });

    it('should change password with correct current password', async () => {
      const res = await request(app)
        .post(`${API}/change-password`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ currentPassword: testUser.password, newPassword })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should login with new password', async () => {
      const res = await request(app)
        .post(`${API}/login`)
        .send({ email: testUser.email, password: newPassword })
        .expect(200);

      expect(res.body.success).toBe(true);
      accessToken = res.body.data.tokens.accessToken;
      refreshToken = res.body.data.tokens.refreshToken;
    });
  });

  // ── Forgot / Reset Password ─────────────────────────────────

  describe('POST /auth/forgot-password + /auth/reset-password', () => {
    let resetToken: string;

    it('should accept forgot-password for existing email', async () => {
      const res = await request(app)
        .post(`${API}/forgot-password`)
        .send({ email: testUser.email })
        .expect(200);

      expect(res.body.success).toBe(true);
      resetToken = res.body.data.resetToken;
      expect(resetToken).toBeDefined();
    });

    it('should not reveal if email does not exist', async () => {
      const res = await request(app)
        .post(`${API}/forgot-password`)
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      // Same success response — no email enumeration
      expect(res.body.success).toBe(true);
    });

    it('should reject invalid reset token', async () => {
      const res = await request(app)
        .post(`${API}/reset-password`)
        .send({ token: 'invalid-token', newPassword: 'ResetP@ss3!' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reset password with valid token', async () => {
      const res = await request(app)
        .post(`${API}/reset-password`)
        .send({ token: resetToken, newPassword: 'ResetP@ss3!' })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should login with reset password', async () => {
      const res = await request(app)
        .post(`${API}/login`)
        .send({ email: testUser.email, password: 'ResetP@ss3!' })
        .expect(200);

      expect(res.body.success).toBe(true);
      accessToken = res.body.data.tokens.accessToken;
      refreshToken = res.body.data.tokens.refreshToken;
    });
  });

  // ── Logout ──────────────────────────────────────────────────

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post(`${API}/logout`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should reject old refresh token after logout', async () => {
      const res = await request(app)
        .post(`${API}/refresh`)
        .send({ refreshToken })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  // ── Health Checks ───────────────────────────────────────────

  describe('Health Endpoints', () => {
    it('GET /health/live should return alive', async () => {
      const res = await request(app).get('/health/live').expect(200);
      expect(res.body.data.status).toBe('alive');
    });

    it('GET /health/ready should return ready', async () => {
      const res = await request(app).get('/health/ready').expect(200);
      expect(res.body.data.status).toBe('ready');
    });
  });

  // ── 404 Handler ─────────────────────────────────────────────

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/v1/unknown').expect(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });
});
