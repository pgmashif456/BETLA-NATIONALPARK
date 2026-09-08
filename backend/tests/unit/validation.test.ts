import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  verifyEmailSchema,
  refreshTokenSchema,
} from '../../src/modules/auth/auth.validation';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'TestP@ss1',
      firstName: 'John',
      lastName: 'Doe',
      role: 'TOURIST' as const,
    };

    it('should accept valid registration input', () => {
      const result = registerSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const { email, ...rest } = validInput;
      const result = registerSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({ ...validInput, email: 'notanemail' });
      expect(result.success).toBe(false);
    });

    it('should reject weak password (no uppercase)', () => {
      const result = registerSchema.safeParse({ ...validInput, password: 'testp@ss1' });
      expect(result.success).toBe(false);
    });

    it('should reject weak password (no special char)', () => {
      const result = registerSchema.safeParse({ ...validInput, password: 'TestPass1' });
      expect(result.success).toBe(false);
    });

    it('should reject weak password (too short)', () => {
      const result = registerSchema.safeParse({ ...validInput, password: 'Te@1' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const result = registerSchema.safeParse({ ...validInput, role: 'ADMIN' });
      expect(result.success).toBe(false);
    });

    it('should reject FOREST_AUTHORITY role for registration', () => {
      const result = registerSchema.safeParse({ ...validInput, role: 'FOREST_AUTHORITY' });
      expect(result.success).toBe(false);
    });

    it('should accept optional phone', () => {
      const result = registerSchema.safeParse({ ...validInput, phone: '+919876543210' });
      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const result = registerSchema.safeParse({ ...validInput, email: 'TEST@Example.COM' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login input', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should accept valid change password input', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldP@ss1',
        newPassword: 'NewP@ss1',
      });
      expect(result.success).toBe(true);
    });

    it('should reject weak new password', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'OldP@ss1',
        newPassword: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should accept valid reset password input', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'some-valid-token',
        newPassword: 'NewP@ss1',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should accept valid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'invalid' });
      expect(result.success).toBe(false);
    });
  });

  describe('verifyEmailSchema', () => {
    it('should accept valid token', () => {
      const result = verifyEmailSchema.safeParse({ token: 'verification-token' });
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const result = verifyEmailSchema.safeParse({ token: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshTokenSchema', () => {
    it('should accept valid refresh token', () => {
      const result = refreshTokenSchema.safeParse({ refreshToken: 'some-refresh-token' });
      expect(result.success).toBe(true);
    });

    it('should reject missing refresh token', () => {
      const result = refreshTokenSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
