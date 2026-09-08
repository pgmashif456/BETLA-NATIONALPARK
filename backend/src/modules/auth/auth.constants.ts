// ── Error Codes ─────────────────────────────────────────────
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'An account with this email already exists',
  },
  PHONE_ALREADY_EXISTS: {
    code: 'PHONE_ALREADY_EXISTS',
    message: 'An account with this phone number already exists',
  },
  ACCOUNT_NOT_VERIFIED: {
    code: 'ACCOUNT_NOT_VERIFIED',
    message: 'Please verify your email address before logging in',
  },
  ACCOUNT_SUSPENDED: {
    code: 'ACCOUNT_SUSPENDED',
    message: 'Your account has been suspended. Please contact support.',
  },
  ACCOUNT_BLOCKED: {
    code: 'ACCOUNT_BLOCKED',
    message: 'Your account has been blocked. Please contact support.',
  },
  ACCOUNT_DEACTIVATED: {
    code: 'ACCOUNT_DEACTIVATED',
    message: 'Your account has been deactivated',
  },
  ACCOUNT_LOCKED: {
    code: 'ACCOUNT_LOCKED',
    message: 'Account temporarily locked due to too many failed attempts. Please try again later.',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Invalid or expired token',
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Token has expired',
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    message: 'Your session has expired. Please login again.',
  },
  SESSION_REVOKED: {
    code: 'SESSION_REVOKED',
    message: 'Your session has been revoked',
  },
  INVALID_REFRESH_TOKEN: {
    code: 'INVALID_REFRESH_TOKEN',
    message: 'Invalid refresh token',
  },
  INVALID_RESET_TOKEN: {
    code: 'INVALID_RESET_TOKEN',
    message: 'Invalid or expired password reset token',
  },
  INVALID_VERIFICATION_TOKEN: {
    code: 'INVALID_VERIFICATION_TOKEN',
    message: 'Invalid or expired verification token',
  },
  ALREADY_VERIFIED: {
    code: 'ALREADY_VERIFIED',
    message: 'Email is already verified',
  },
  PASSWORD_MISMATCH: {
    code: 'PASSWORD_MISMATCH',
    message: 'Current password is incorrect',
  },
  SAME_PASSWORD: {
    code: 'SAME_PASSWORD',
    message: 'New password must be different from the current password',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'You do not have permission to perform this action',
  },
  ROLE_NOT_FOUND: {
    code: 'ROLE_NOT_FOUND',
    message: 'The specified role does not exist',
  },
} as const;

// ── Constants ───────────────────────────────────────────────
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;
export const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;
export const PASSWORD_REQUIREMENTS =
  'Password must be at least 8 characters with uppercase, lowercase, number, and special character';

// ── Valid Roles for Registration ────────────────────────────
export const REGISTERABLE_ROLES = ['TOURIST', 'GUIDE', 'HOMESTAY'] as const;
