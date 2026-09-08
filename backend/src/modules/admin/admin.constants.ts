// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 8: Admin Constants
// ═══════════════════════════════════════════════════════════════

export const ADMIN_ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
  INVALID_USER_STATUS: 'INVALID_USER_STATUS',
  SETTING_NOT_FOUND: 'SETTING_NOT_FOUND',
  UNAUTHORIZED_ADMIN_ACTION: 'UNAUTHORIZED_ADMIN_ACTION',
} as const;

export const ADMIN_AUDIT_MODULES = {
  USER: 'USER',
  ROLE: 'ROLE',
  PERMISSION: 'PERMISSION',
  SETTING: 'SETTING',
  PROVIDER: 'PROVIDER',
} as const;

export const ADMIN_AUDIT_ACTIONS = {
  UPDATE_USER_STATUS: 'UPDATE_USER_STATUS',
  CREATE_ROLE: 'CREATE_ROLE',
  UPDATE_ROLE: 'UPDATE_ROLE',
  UPDATE_SETTING: 'UPDATE_SETTING',
  PROVIDER_VERIFICATION: 'PROVIDER_VERIFICATION',
} as const;
