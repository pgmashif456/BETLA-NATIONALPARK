// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 4: Safety Validation
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import { IncidentStatus, IncidentPriority, AlertSeverity } from '@prisma/client';

export const createEmergencySchema = z.object({
  type: z.string().trim().optional(),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const createIncidentSchema = z.object({
  type: z.string().min(1, 'Type is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  location: z.string().trim().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  priority: z.nativeEnum(IncidentPriority).optional(),
});

export const updateIncidentStatusSchema = z.object({
  status: z.nativeEnum(IncidentStatus),
  notes: z.string().trim().optional(),
});

export const assignIncidentSchema = z.object({
  assignedToId: z.string().uuid('Invalid user ID format'),
  notes: z.string().trim().optional(),
});

export const addIncidentUpdateSchema = z.object({
  notes: z.string().min(1, 'Update notes are required').trim(),
});

export const createSafetyAlertSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  message: z.string().min(1, 'Message is required').trim(),
  severity: z.nativeEnum(AlertSeverity).optional(),
  area: z.string().trim().optional(),
  expiresAt: z.string().datetime().optional(),
});
