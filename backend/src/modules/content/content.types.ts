// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 3: Content Types
// ═══════════════════════════════════════════════════════════════

import { ContentStatus } from '@prisma/client';

export interface CreateDestinationInput {
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status?: ContentStatus;
  isFeatured?: boolean;
}

export interface UpdateDestinationInput {
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status?: ContentStatus;
  isFeatured?: boolean;
}

export interface CreateAttractionInput {
  destinationId: string;
  categoryId?: string;
  name: string;
  description?: string;
  location?: string;
  openingTime?: string;
  closingTime?: string;
  status?: ContentStatus;
}

export interface UpdateAttractionInput {
  destinationId?: string;
  categoryId?: string;
  name?: string;
  description?: string;
  location?: string;
  openingTime?: string;
  closingTime?: string;
  status?: ContentStatus;
}

export interface CreateExperienceInput {
  destinationId: string;
  categoryId?: string;
  name: string;
  description?: string;
  duration?: string;
  difficulty?: string;
  status?: ContentStatus;
}

export interface UpdateExperienceInput {
  destinationId?: string;
  categoryId?: string;
  name?: string;
  description?: string;
  duration?: string;
  difficulty?: string;
  status?: ContentStatus;
}

export interface CreateActivityInput {
  destinationId: string;
  categoryId?: string;
  name: string;
  description?: string;
  duration?: string;
  status?: ContentStatus;
}

export interface UpdateActivityInput {
  destinationId?: string;
  categoryId?: string;
  name?: string;
  description?: string;
  duration?: string;
  status?: ContentStatus;
}

export interface QueryContentParams {
  status?: ContentStatus | 'ALL';
  categoryId?: string;
  destinationId?: string;
  isFeatured?: boolean;
  search?: string;
}

export interface NearbyQueryParams {
  lat: number;
  lng: number;
  radiusKm?: number;
}
