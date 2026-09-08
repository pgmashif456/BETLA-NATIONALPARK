import request from 'supertest';
import app from '../../src/app';

jest.setTimeout(60000);

describe('Profile API Integration Tests', () => {
  const timestamp = Date.now();
  let touristToken: string;
  let touristUserId: string;

  let guideToken: string;
  let guideUserId: string;

  let homestayToken: string;
  let homestayUserId: string;

  // Setup: Register and verify users for each role before tests run
  beforeAll(async () => {
    // 1. Create Tourist user
    const touristRes = await request(app).post('/api/v1/auth/register').send({
      email: `tourist-${timestamp}@example.com`,
      password: 'TestP@ss1!',
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'TOURIST',
    });
    const touristVerifyToken = touristRes.body.data.verificationToken;
    await request(app).post('/api/v1/auth/verify').send({ token: touristVerifyToken });
    const touristLogin = await request(app).post('/api/v1/auth/login').send({
      email: `tourist-${timestamp}@example.com`,
      password: 'TestP@ss1!',
    });
    touristToken = touristLogin.body.data.tokens.accessToken;
    touristUserId = touristLogin.body.data.user.id;

    // 2. Create Guide user
    const guideRes = await request(app).post('/api/v1/auth/register').send({
      email: `guide-${timestamp}@example.com`,
      password: 'TestP@ss1!',
      firstName: 'Birsa',
      lastName: 'Munda',
      role: 'GUIDE',
    });
    const guideVerifyToken = guideRes.body.data.verificationToken;
    await request(app).post('/api/v1/auth/verify').send({ token: guideVerifyToken });
    const guideLogin = await request(app).post('/api/v1/auth/login').send({
      email: `guide-${timestamp}@example.com`,
      password: 'TestP@ss1!',
    });
    guideToken = guideLogin.body.data.tokens.accessToken;
    guideUserId = guideLogin.body.data.user.id;

    // 3. Create Homestay user
    const homestayRes = await request(app).post('/api/v1/auth/register').send({
      email: `homestay-${timestamp}@example.com`,
      password: 'TestP@ss1!',
      firstName: 'Anand',
      lastName: 'Prasad',
      role: 'HOMESTAY',
    });
    const homestayVerifyToken = homestayRes.body.data.verificationToken;
    await request(app).post('/api/v1/auth/verify').send({ token: homestayVerifyToken });
    const homestayLogin = await request(app).post('/api/v1/auth/login').send({
      email: `homestay-${timestamp}@example.com`,
      password: 'TestP@ss1!',
    });
    homestayToken = homestayLogin.body.data.tokens.accessToken;
    homestayUserId = homestayLogin.body.data.user.id;
  });

  // ── Authentication & Security Checks ────────────────────────

  describe('Unauthenticated & Authorization Protection', () => {
    it('should reject unauthenticated profile requests with 401', async () => {
      await request(app).get('/api/v1/profile').expect(401);
      await request(app).get('/api/v1/tourist/profile').expect(401);
      await request(app).get('/api/v1/guide/profile').expect(401);
      await request(app).get('/api/v1/homestay/profile').expect(401);
    });

    it('should reject guide profile access by tourist role with 403', async () => {
      const res = await request(app)
        .get('/api/v1/guide/profile')
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should reject homestay profile access by tourist role with 403', async () => {
      const res = await request(app)
        .get('/api/v1/homestay/profile')
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(403);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Unified Profile Endpoints ────────────────────────────────

  describe('GET & PATCH /api/v1/profile', () => {
    it('should return unified tourist profile for tourist user', async () => {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.stakeholderType).toBe('TOURIST');
      expect(res.body.data.user.id).toBe(touristUserId);
      expect(res.body.data.profile.fullName).toBe('Rahul Sharma');
      expect(res.body.data.profile.profileCompletion).toBeDefined();
    });

    it('should patch tourist profile through generic endpoint', async () => {
      const res = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          city: 'Daltonganj',
          state: 'Jharkhand',
          country: 'India',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.city).toBe('Daltonganj');
    });
  });

  // ── Tourist Profile Endpoints ────────────────────────────────

  describe('Tourist Profile API', () => {
    it('should get current tourist profile', async () => {
      const res = await request(app)
        .get('/api/v1/tourist/profile')
        .set('Authorization', `Bearer ${touristToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.userId).toBe(touristUserId);
    });

    it('should update tourist profile fields and recalculate profile completion', async () => {
      const res = await request(app)
        .patch('/api/v1/tourist/profile')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          gender: 'MALE',
          address: 'Main Market Road',
          postalCode: '822101',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.gender).toBe('MALE');
      expect(res.body.data.profile.postalCode).toBe('822101');
      expect(res.body.data.profile.profileCompletion).toBeDefined();
    });

    it('should reject invalid payload validation', async () => {
      const res = await request(app)
        .patch('/api/v1/tourist/profile')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          dateOfBirth: 'not-a-valid-date',
        })
        .expect(422);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // ── Guide Profile & Verification Endpoints ──────────────────

  describe('Guide Profile & Verification API', () => {
    it('should get guide profile for guide user', async () => {
      const res = await request(app)
        .get('/api/v1/guide/profile')
        .set('Authorization', `Bearer ${guideToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.userId).toBe(guideUserId);
      expect(res.body.data.profile.verificationStatus).toBe('UNVERIFIED');
    });

    it('should update guide profile bio and specializations', async () => {
      const res = await request(app)
        .patch('/api/v1/guide/profile')
        .set('Authorization', `Bearer ${guideToken}`)
        .send({
          bio: 'Certified Betla forest guide with extensive wildlife experience.',
          experienceYears: 7,
          languages: ['Hindi', 'English', 'Kurukh'],
          specializations: ['Tiger Tracking', 'Jungle Safari', 'Bird Watching'],
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.experienceYears).toBe(7);
      expect(res.body.data.profile.languages).toContain('Kurukh');
    });

    it('should submit verification document for guide', async () => {
      const res = await request(app)
        .post('/api/v1/guide/profile/verification')
        .set('Authorization', `Bearer ${guideToken}`)
        .send({
          documentType: 'GUIDE_LICENSE',
          documentUrl: 'https://example.com/docs/guide_license.pdf',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationStatus).toBe('PENDING');
      expect(res.body.data.documents.length).toBeGreaterThan(0);
      expect(res.body.data.documents[0].documentType).toBe('GUIDE_LICENSE');
    });

    it('should get guide verification status and uploaded documents', async () => {
      const res = await request(app)
        .get('/api/v1/guide/profile/verification')
        .set('Authorization', `Bearer ${guideToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationStatus).toBe('PENDING');
      expect(res.body.data.documents.length).toBe(1);
    });

    it('should reject invalid document submission payload', async () => {
      const res = await request(app)
        .post('/api/v1/guide/profile/verification')
        .set('Authorization', `Bearer ${guideToken}`)
        .send({
          documentType: 'INVALID_TYPE',
          documentUrl: 'https://example.com/doc.pdf',
        })
        .expect(422);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // ── Homestay Profile & Verification Endpoints ────────────────

  describe('Homestay Profile & Verification API', () => {
    it('should get homestay profile for homestay owner', async () => {
      const res = await request(app)
        .get('/api/v1/homestay/profile')
        .set('Authorization', `Bearer ${homestayToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.userId).toBe(homestayUserId);
      expect(res.body.data.profile.verificationStatus).toBe('UNVERIFIED');
    });

    it('should update homestay profile details', async () => {
      const res = await request(app)
        .patch('/api/v1/homestay/profile')
        .set('Authorization', `Bearer ${homestayToken}`)
        .send({
          propertyName: 'Betla Green Haven Homestay',
          description: 'Eco-friendly stay right next to Betla National Park entrance.',
          contactPhone: '+919876543210',
          address: 'Betla Village, Latehar',
          city: 'Latehar',
          state: 'Jharkhand',
          country: 'India',
          latitude: 23.8872,
          longitude: 84.1918,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.propertyName).toBe('Betla Green Haven Homestay');
      expect(res.body.data.profile.latitude).toBe(23.8872);
      expect(res.body.data.profile.profileCompletion).toBeDefined();
    });

    it('should submit verification document for homestay', async () => {
      const res = await request(app)
        .post('/api/v1/homestay/profile/verification')
        .set('Authorization', `Bearer ${homestayToken}`)
        .send({
          documentType: 'PROPERTY_DEED',
          documentUrl: 'https://example.com/docs/property_deed.pdf',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationStatus).toBe('PENDING');
      expect(res.body.data.documents.length).toBe(1);
    });

    it('should get homestay verification status', async () => {
      const res = await request(app)
        .get('/api/v1/homestay/profile/verification')
        .set('Authorization', `Bearer ${homestayToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationStatus).toBe('PENDING');
      expect(res.body.data.documents.length).toBe(1);
    });
  });
});
