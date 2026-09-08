export const ALLOWED_ANALYTICS_ROLES = ['ADMIN', 'FOREST_AUTHORITY'] as const;

export const ANALYTICS_ERRORS = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required to access analytics',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'You do not have permission to access analytics endpoints',
  },
} as const;
