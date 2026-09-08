// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 3: Content Validation
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

const contentStatusEnum = z.nativeEnum(ContentStatus);

export const createDestinationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().max(250).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  location: z.string().max(255).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  status: contentStatusEnum.optional(),
  isFeatured: z.boolean().optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export const createAttractionSchema = z.object({
  destinationId: z.string().uuid('Valid destinationId is required'),
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  location: z.string().max(255).optional(),
  openingTime: z.string().max(20).optional(),
  closingTime: z.string().max(20).optional(),
  status: contentStatusEnum.optional(),
});

export const updateAttractionSchema = createAttractionSchema.partial();

export const createExperienceSchema = z.object({
  destinationId: z.string().uuid('Valid destinationId is required'),
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  duration: z.string().max(50).optional(),
  difficulty: z.string().max(50).optional(),
  status: contentStatusEnum.optional(),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export const createActivitySchema = z.object({
  destinationId: z.string().uuid('Valid destinationId is required'),
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  duration: z.string().max(50).optional(),
  status: contentStatusEnum.optional(),
});

export const updateActivitySchema = createActivitySchema.partial();

export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90, 'Valid latitude required'),
  lng: z.coerce.number().min(-180).max(180, 'Valid longitude required'),
  radiusKm: z.coerce.number().positive().optional().default(50),
});
