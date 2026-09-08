import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET = 'test-access-secret-for-unit-tests-min32chars';
const REFRESH_SECRET = 'test-refresh-secret-for-unit-tests-min32chars';

describe('Token Generation & Verification', () => {
  describe('Access Token', () => {
    const payload = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      role: 'TOURIST',
      permissions: ['profile:read', 'profile:update'],
      type: 'access' as const,
    };

    it('should generate a valid JWT access token', () => {
      const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
      expect(token).toBeDefined();
      expect(token.split('.')).toHaveLength(3);
    });

    it('should verify a valid access token', () => {
      const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
      const decoded = jwt.verify(token, ACCESS_SECRET) as any;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.permissions).toEqual(payload.permissions);
      expect(decoded.type).toBe('access');
    });

    it('should reject a token signed with wrong secret', () => {
      const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow();
    });

    it('should reject an expired token', () => {
      const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '0s' });
      expect(() => {
        jwt.verify(token, ACCESS_SECRET);
      }).toThrow(jwt.TokenExpiredError);
    });

    it('should reject a malformed token', () => {
      expect(() => {
        jwt.verify('not.a.valid.token', ACCESS_SECRET);
      }).toThrow(jwt.JsonWebTokenError);
    });
  });

  describe('Refresh Token', () => {
    const payload = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      sessionId: '987fcdeb-51a2-43e7-8901-234567890abc',
      type: 'refresh' as const,
    };

    it('should generate a valid JWT refresh token', () => {
      const token = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
      expect(token).toBeDefined();

      const decoded = jwt.verify(token, REFRESH_SECRET) as any;
      expect(decoded.type).toBe('refresh');
      expect(decoded.sessionId).toBe(payload.sessionId);
    });

    it('should not verify refresh token with access secret', () => {
      const token = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
      expect(() => {
        jwt.verify(token, ACCESS_SECRET);
      }).toThrow();
    });
  });

  describe('Token Hashing (SHA-256)', () => {
    it('should produce a consistent hash for the same token', () => {
      const token = 'test-refresh-token-value';
      const hash1 = crypto.createHash('sha256').update(token).digest('hex');
      const hash2 = crypto.createHash('sha256').update(token).digest('hex');

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different tokens', () => {
      const hash1 = crypto.createHash('sha256').update('token-a').digest('hex');
      const hash2 = crypto.createHash('sha256').update('token-b').digest('hex');

      expect(hash1).not.toBe(hash2);
    });

    it('should produce a 64-character hex string', () => {
      const hash = crypto.createHash('sha256').update('test-token').digest('hex');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
  });
});
