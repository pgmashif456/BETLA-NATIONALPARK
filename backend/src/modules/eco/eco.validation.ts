// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 5: Eco Validation
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { IncidentPriority, EcoReportStatus } from '@prisma/client';

export const createEcoReportSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID format').optional(),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  location: z.string().max(255).optional(),
  priority: z.nativeEnum(IncidentPriority).optional(),
});

export const updateEcoReportStatusSchema = z.object({
  status: z.nativeEnum(EcoReportStatus, {
    errorMap: () => ({ message: 'Invalid eco report status' }),
  }),
  notes: z.string().max(1000).optional(),
});

export const assignEcoReportSchema = z.object({
  assignedToId: z.string().uuid('Invalid assigned user ID format'),
  notes: z.string().max(1000).optional(),
});

export const createEcoActivitySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  activityDate: z.string().or(z.date()).transform((val) => new Date(val)),
  location: z.string().max(255).optional(),
  organizer: z.string().max(150).optional(),
  status: z.string().max(20).optional(),
});

export const updateEcoActivitySchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(5).optional(),
  activityDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
  location: z.string().max(255).optional(),
  organizer: z.string().max(150).optional(),
  status: z.string().max(20).optional(),
});
