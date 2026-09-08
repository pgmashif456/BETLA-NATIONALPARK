export const PROFILE_ERRORS = {
  PROFILE_NOT_FOUND: {
    code: 'PROFILE_NOT_FOUND',
    message: 'Profile not found for this user',
  },
  INVALID_STAKEHOLDER_TYPE: {
    code: 'INVALID_STAKEHOLDER_TYPE',
    message: 'Invalid stakeholder profile type for current user role',
  },
  UNAUTHORIZED_PROFILE_ACCESS: {
    code: 'UNAUTHORIZED_PROFILE_ACCESS',
    message: 'You are not authorized to access or modify this profile',
  },
  DOCUMENT_REQUIRED: {
    code: 'DOCUMENT_REQUIRED',
    message: 'Document type and URL are required for verification submission',
  },
  INVALID_DOCUMENT_TYPE: {
    code: 'INVALID_DOCUMENT_TYPE',
    message: 'Invalid verification document type provided',
  },
} as const;

export const VALID_DOCUMENT_TYPES = [
  'GOVT_ID',
  'AADHAAR',
  'PAN_CARD',
  'PASSPORT',
  'DRIVING_LICENSE',
  'GUIDE_LICENSE',
  'PROPERTY_DEED',
  'TAX_REGISTRATION',
  'OTHER',
];
