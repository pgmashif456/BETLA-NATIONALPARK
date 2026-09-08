// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 3: Content Service
// ═══════════════════════════════════════════════════════════════

import { ContentStatus } from '@prisma/client';
import { ContentRepository } from './content.repository';
import { NotFoundError, BadRequestError } from '../../common/errors/AppError';
import {
  CreateDestinationInput,
  UpdateDestinationInput,
  CreateAttractionInput,
  UpdateAttractionInput,
  CreateExperienceInput,
  UpdateExperienceInput,
  CreateActivityInput,
  UpdateActivityInput,
  QueryContentParams,
  NearbyQueryParams,
} from './content.types';
import { CONTENT_ERROR_CODES } from './content.constants';

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class ContentService {
  private repository: ContentRepository;

  constructor() {
    this.repository = new ContentRepository();
  }

  // ── Destinations ──────────────────────────────────────────────

  async getDestinations(params: QueryContentParams, isPublicRequest = true) {
    const queryParams: QueryContentParams = { ...params };
    if (isPublicRequest) {
      queryParams.status = ContentStatus.PUBLISHED;
    }
    return this.repository.findDestinations(queryParams);
  }

  async getDestinationById(id: string, isPublicRequest = true) {
    const destination = await this.repository.findDestinationById(id);
    if (!destination) {
      throw new NotFoundError(
        `Destination with ID ${id} not found`,
        CONTENT_ERROR_CODES.DESTINATION_NOT_FOUND
      );
    }

    if (isPublicRequest && destination.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundError(
        `Destination with ID ${id} is not publicly available`,
        CONTENT_ERROR_CODES.DESTINATION_NOT_FOUND
      );
    }

    return destination;
  }

  async createDestination(input: CreateDestinationInput) {
    const slug = input.slug || generateSlug(input.name);
    const existing = await this.repository.findDestinationBySlug(slug);
    if (existing) {
      throw new BadRequestError(
        `Destination with slug '${slug}' already exists`,
        CONTENT_ERROR_CODES.SLUG_EXISTS
      );
    }

    return this.repository.createDestination({
      ...input,
      slug,
    });
  }

  async updateDestination(id: string, input: UpdateDestinationInput) {
    const destination = await this.repository.findDestinationById(id);
    if (!destination) {
      throw new NotFoundError(
        `Destination with ID ${id} not found`,
        CONTENT_ERROR_CODES.DESTINATION_NOT_FOUND
      );
    }

    if (input.slug && input.slug !== destination.slug) {
      const existing = await this.repository.findDestinationBySlug(input.slug);
      if (existing) {
        throw new BadRequestError(
          `Destination with slug '${input.slug}' already exists`,
          CONTENT_ERROR_CODES.SLUG_EXISTS
        );
      }
    }

    return this.repository.updateDestination(id, input);
  }

  async deleteDestination(id: string) {
    const destination = await this.repository.findDestinationById(id);
    if (!destination) {
      throw new NotFoundError(
        `Destination with ID ${id} not found`,
        CONTENT_ERROR_CODES.DESTINATION_NOT_FOUND
      );
    }

    return this.repository.deleteDestination(id);
  }

  // ── Attractions ───────────────────────────────────────────────

  async getAttractions(params: QueryContentParams, isPublicRequest = true) {
    const queryParams: QueryContentParams = { ...params };
    if (isPublicRequest) {
      queryParams.status = ContentStatus.PUBLISHED;
    }
    return this.repository.findAttractions(queryParams);
  }

  async getAttractionById(id: string, isPublicRequest = true) {
    const attraction = await this.repository.findAttractionById(id);
    if (!attraction) {
      throw new NotFoundError(
        `Attraction with ID ${id} not found`,
        CONTENT_ERROR_CODES.ATTRACTION_NOT_FOUND
      );
    }

    if (isPublicRequest && attraction.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundError(
        `Attraction with ID ${id} is not publicly available`,
        CONTENT_ERROR_CODES.ATTRACTION_NOT_FOUND
      );
    }

    return attraction;
  }

  async createAttraction(input: CreateAttractionInput) {
    const destination = await this.repository.findDestinationById(input.destinationId);
    if (!destination) {
      throw new NotFoundError(
        `Destination with ID ${input.destinationId} not found`,
        CONTENT_ERROR_CODES.DESTINATION_NOT_FOUND
      );
    }

    return this.repository.createAttraction(input);
  }

  async updateAttraction(id: string, input: UpdateAttractionInput) {
    const attraction = await this.repository.findAttractionById(id);
    if (!attraction) {
      throw new NotFoundError(
        `Attraction with ID ${id} not found`,
        CONTENT_ERROR_CODES.ATTRACTION_NOT_FOUND
      );
    }

    return this.repository.updateAttraction(id, input);
  }

  // ── Experiences ───────────────────────────────────────────────

  async getExperiences(params: QueryContentParams, isPublicRequest = true) {
    const queryParams: QueryContentParams = { ...params };
    if (isPublicRequest) {
      queryParams.status = ContentStatus.PUBLISHED;
    }
    return this.repository.findExperiences(queryParams);
  }

  async getExperienceById(id: string, isPublicRequest = true) {
    const experience = await this.repository.findExperienceById(id);
    if (!experience) {
      throw new NotFoundError(
        `Experience with ID ${id} not found`,
        CONTENT_ERROR_CODES.EXPERIENCE_NOT_FOUND
      );
    }

    if (isPublicRequest && experience.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundError(
        `Experience with ID ${id} is not publicly available`,
        CONTENT_ERROR_CODES.EXPERIENCE_NOT_FOUND
      );
    }

    return experience;
  }

  async createExperience(input: CreateExperienceInput) {
    const destination = await this.repository.findDestinationById(input.destinationId);
    if (!destination) {
      throw new NotFoundError(
        `Destination with ID ${input.destinationId} not found`,
        CONTENT_ERROR_CODES.DESTINATION_NOT_FOUND
      );
    }

    return this.repository.createExperience(input);
  }

  async updateExperience(id: string, input: UpdateExperienceInput) {
    const experience = await this.repository.findExperienceById(id);
    if (!experience) {
      throw new NotFoundError(
        `Experience with ID ${id} not found`,
        CONTENT_ERROR_CODES.EXPERIENCE_NOT_FOUND
      );
    }

    return this.repository.updateExperience(id, input);
  }

  // ── Activities ────────────────────────────────────────────────

  async getActivities(params: QueryContentParams, isPublicRequest = true) {
    const queryParams: QueryContentParams = { ...params };
    if (isPublicRequest) {
      queryParams.status = ContentStatus.PUBLISHED;
    }
    return this.repository.findActivities(queryParams);
  }

  async getActivityById(id: string, isPublicRequest = true) {
    const activity = await this.repository.findActivityById(id);
    if (!activity) {
      throw new NotFoundError(
        `Activity with ID ${id} not found`,
        CONTENT_ERROR_CODES.ACTIVITY_NOT_FOUND
      );
    }

    if (isPublicRequest && activity.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundError(
        `Activity with ID ${id} is not publicly available`,
        CONTENT_ERROR_CODES.ACTIVITY_NOT_FOUND
      );
    }

    return activity;
  }

  async createActivity(input: CreateActivityInput) {
    const destination = await this.repository.findDestinationById(input.destinationId);
    if (!destination) {
      throw new NotFoundError(
        `Destination with ID ${input.destinationId} not found`,
        CONTENT_ERROR_CODES.DESTINATION_NOT_FOUND
      );
    }

    return this.repository.createActivity(input);
  }

  async updateActivity(id: string, input: UpdateActivityInput) {
    const activity = await this.repository.findActivityById(id);
    if (!activity) {
      throw new NotFoundError(
        `Activity with ID ${id} not found`,
        CONTENT_ERROR_CODES.ACTIVITY_NOT_FOUND
      );
    }

    return this.repository.updateActivity(id, input);
  }

  // ── Categories ────────────────────────────────────────────────

  async getCategories() {
    return this.repository.findCategories();
  }

  // ── Aggregated Discover ──────────────────────────────────────

  async getDiscoverData() {
    const destinations = await this.repository.findDestinations({ status: ContentStatus.PUBLISHED });
    const attractions = await this.repository.findAttractions({ status: ContentStatus.PUBLISHED });
    const experiences = await this.repository.findExperiences({ status: ContentStatus.PUBLISHED });
    const activities = await this.repository.findActivities({ status: ContentStatus.PUBLISHED });
    const categories = await this.repository.findCategories();

    return {
      destinations,
      attractions,
      experiences,
      activities,
      categories,
    };
  }


  // ── Nearby Geolocation ────────────────────────────────────────

  async getNearbyDestinations(params: NearbyQueryParams) {
    const radius = params.radiusKm ?? 50;
    const destinations = await this.repository.findDestinations({ status: ContentStatus.PUBLISHED });

    const nearby = destinations
      .filter((dest: { latitude: number | null; longitude: number | null }) => dest.latitude !== null && dest.longitude !== null)
      .map((dest: { latitude: number | null; longitude: number | null; [key: string]: any }) => {
        const distanceKm = calculateHaversineDistance(
          params.lat,
          params.lng,
          dest.latitude!,
          dest.longitude!
        );
        return {
          ...dest,
          distanceKm,
        };
      })
      .filter((dest: { distanceKm: number }) => dest.distanceKm <= radius)
      .sort((a: { distanceKm: number }, b: { distanceKm: number }) => a.distanceKm - b.distanceKm);

    return nearby;
  }
}
