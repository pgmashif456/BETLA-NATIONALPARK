// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 3: Content Controller
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { ContentService } from './content.service';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AuthenticatedRequest } from '../../common/types';
import {
  createDestinationSchema,
  updateDestinationSchema,
  createAttractionSchema,
  updateAttractionSchema,
  createExperienceSchema,
  updateExperienceSchema,
  createActivitySchema,
  updateActivitySchema,
  nearbyQuerySchema,
} from './content.validation';
import { ContentStatus } from '@prisma/client';

const contentService = new ContentService();

function isManagementUser(req: AuthenticatedRequest): boolean {
  if (!req.user) return false;
  const userPermissions: string[] = req.user.permissions || [];
  return (
    userPermissions.includes('destinations:create') ||
    userPermissions.includes('destinations:update') ||
    req.user.role === 'ADMIN' ||
    req.user.role === 'FOREST_AUTHORITY'
  );
}

// ── Destinations Controller ────────────────────────────────────

export async function getDestinations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const isPublic = !isMgmt || !req.query.status;

    const params = {
      status: req.query.status as ContentStatus,
      isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
      search: req.query.search as string,
    };

    const destinations = await contentService.getDestinations(params, isPublic);
    sendSuccess(res, destinations);
  } catch (error) {
    next(error);
  }
}

export async function getDestinationById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const id = req.params.id as string;
    const destination = await contentService.getDestinationById(id, !isMgmt);
    sendSuccess(res, destination);
  } catch (error) {
    next(error);
  }
}

export async function createDestination(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createDestinationSchema.parse(req.body);
    const destination = await contentService.createDestination(validatedData);
    sendSuccess(res, destination, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateDestination(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = updateDestinationSchema.parse(req.body);
    const id = req.params.id as string;
    const destination = await contentService.updateDestination(id, validatedData);
    sendSuccess(res, destination);
  } catch (error) {
    next(error);
  }
}

export async function deleteDestination(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await contentService.deleteDestination(id);
    sendSuccess(res, { message: 'Destination deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// ── Attractions Controller ─────────────────────────────────────

export async function getAttractions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const isPublic = !isMgmt || !req.query.status;

    const params = {
      status: req.query.status as ContentStatus,
      destinationId: req.query.destinationId as string,
      categoryId: req.query.categoryId as string,
      search: req.query.search as string,
    };

    const attractions = await contentService.getAttractions(params, isPublic);
    sendSuccess(res, attractions);
  } catch (error) {
    next(error);
  }
}

export async function getAttractionById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const id = req.params.id as string;
    const attraction = await contentService.getAttractionById(id, !isMgmt);
    sendSuccess(res, attraction);
  } catch (error) {
    next(error);
  }
}

export async function createAttraction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createAttractionSchema.parse(req.body);
    const attraction = await contentService.createAttraction(validatedData);
    sendSuccess(res, attraction, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAttraction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = updateAttractionSchema.parse(req.body);
    const id = req.params.id as string;
    const attraction = await contentService.updateAttraction(id, validatedData);
    sendSuccess(res, attraction);
  } catch (error) {
    next(error);
  }
}

// ── Experiences Controller ─────────────────────────────────────

export async function getExperiences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const isPublic = !isMgmt || !req.query.status;

    const params = {
      status: req.query.status as ContentStatus,
      destinationId: req.query.destinationId as string,
      categoryId: req.query.categoryId as string,
      search: req.query.search as string,
    };

    const experiences = await contentService.getExperiences(params, isPublic);
    sendSuccess(res, experiences);
  } catch (error) {
    next(error);
  }
}

export async function getExperienceById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const id = req.params.id as string;
    const experience = await contentService.getExperienceById(id, !isMgmt);
    sendSuccess(res, experience);
  } catch (error) {
    next(error);
  }
}

export async function createExperience(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createExperienceSchema.parse(req.body);
    const experience = await contentService.createExperience(validatedData);
    sendSuccess(res, experience, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateExperience(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = updateExperienceSchema.parse(req.body);
    const id = req.params.id as string;
    const experience = await contentService.updateExperience(id, validatedData);
    sendSuccess(res, experience);
  } catch (error) {
    next(error);
  }
}

// ── Activities Controller ──────────────────────────────────────

export async function getActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const isPublic = !isMgmt || !req.query.status;

    const params = {
      status: req.query.status as ContentStatus,
      destinationId: req.query.destinationId as string,
      categoryId: req.query.categoryId as string,
      search: req.query.search as string,
    };

    const activities = await contentService.getActivities(params, isPublic);
    sendSuccess(res, activities);
  } catch (error) {
    next(error);
  }
}

export async function getActivityById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const isMgmt = isManagementUser(req);
    const id = req.params.id as string;
    const activity = await contentService.getActivityById(id, !isMgmt);
    sendSuccess(res, activity);
  } catch (error) {
    next(error);
  }
}

export async function createActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = createActivitySchema.parse(req.body);
    const activity = await contentService.createActivity(validatedData);
    sendSuccess(res, activity, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validatedData = updateActivitySchema.parse(req.body);
    const id = req.params.id as string;
    const activity = await contentService.updateActivity(id, validatedData);
    sendSuccess(res, activity);
  } catch (error) {
    next(error);
  }
}

// ── Categories Controller ──────────────────────────────────────

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await contentService.getCategories();
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

// ── Aggregated Discover Controller ────────────────────────────

export async function getDiscoverData(_req: Request, res: Response, next: NextFunction) {
  try {
    const discoverData = await contentService.getDiscoverData();
    sendSuccess(res, discoverData);
  } catch (error) {
    next(error);
  }
}

// ── Nearby Controller ──────────────────────────────────────────

export async function getNearbyDestinations(req: Request, res: Response, next: NextFunction) {
  try {
    const queryParams = nearbyQuerySchema.parse(req.query);
    const destinations = await contentService.getNearbyDestinations(queryParams);
    sendSuccess(res, destinations);
  } catch (error) {
    next(error);
  }
}
