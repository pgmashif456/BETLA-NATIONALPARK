import { z } from 'zod';
import { VALID_DOCUMENT_TYPES } from './profile.constants';

export const updateTouristProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name cannot be empty').max(150).optional(),
  profileImage: z.string().url('Profile image must be a valid URL').or(z.string().max(500)).optional().nullable(),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date of birth' })
    .optional()
    .nullable(),
  gender: z.string().max(20).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
});

export const updateGuideProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name cannot be empty').max(150).optional(),
  profileImage: z.string().url('Profile image must be a valid URL').or(z.string().max(500)).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  experienceYears: z.number().int().min(0, 'Experience years must be non-negative').max(70).optional(),
  languages: z.array(z.string().max(50)).optional(),
  specializations: z.array(z.string().max(100)).optional(),
  address: z.string().max(255).optional().nullable(),
});

export const updateHomestayProfileSchema = z.object({
  propertyName: z.string().min(1, 'Property name cannot be empty').max(200).optional(),
  ownerName: z.string().min(1, 'Owner name cannot be empty').max(150).optional(),
  description: z.string().max(2000).optional().nullable(),
  contactPhone: z.string().max(20).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

export const submitVerificationDocumentSchema = z.object({
  documentType: z
    .string({ required_error: 'Document type is required' })
    .min(1, 'Document type is required')
    .refine((val) => VALID_DOCUMENT_TYPES.includes(val.toUpperCase()), {
      message: `Document type must be one of: ${VALID_DOCUMENT_TYPES.join(', ')}`,
    })
    .transform((val) => val.toUpperCase()),
  documentUrl: z
    .string({ required_error: 'Document URL is required' })
    .min(1, 'Document URL is required')
    .max(500, 'Document URL must be at most 500 characters'),
});
