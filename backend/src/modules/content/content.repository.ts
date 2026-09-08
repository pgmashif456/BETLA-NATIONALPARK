// ═══════════════════════════════════════════════════════════════
// Betla Eco-Companion — Module 3: Content Repository
// ═══════════════════════════════════════════════════════════════

import { prisma } from '../../database/client';
import { ContentStatus, Prisma } from '@prisma/client';
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
} from './content.types';

export class ContentRepository {
  // ── Destinations ──────────────────────────────────────────────

  async findDestinationById(id: string) {
    return prisma.destination.findUnique({
      where: { id },
      include: {
        attractions: true,
        experiences: true,
        activities: true,
        media: true,
        information: true,
      },
    });
  }

  async findDestinationBySlug(slug: string) {
    return prisma.destination.findUnique({
      where: { slug },
    });
  }

  async findDestinations(params: QueryContentParams) {
    const where: Prisma.DestinationWhereInput = {};

    if (params.status && (params.status as string) !== 'ALL') {
      where.status = params.status as ContentStatus;
    }
    if (params.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { shortDescription: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { location: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.destination.findMany({
      where,
      include: {
        media: true,
        information: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDestination(data: CreateDestinationInput & { slug: string }) {
    return prisma.destination.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        status: data.status ?? ContentStatus.DRAFT,
        isFeatured: data.isFeatured ?? false,
      },
    });
  }

  async updateDestination(id: string, data: UpdateDestinationInput) {
    return prisma.destination.update({
      where: { id },
      data,
    });
  }

  async deleteDestination(id: string) {
    return prisma.destination.delete({
      where: { id },
    });
  }

  // ── Attractions ───────────────────────────────────────────────

  async findAttractionById(id: string) {
    return prisma.attraction.findUnique({
      where: { id },
      include: {
        destination: true,
        category: true,
      },
    });
  }

  async findAttractions(params: QueryContentParams) {
    const where: Prisma.AttractionWhereInput = {};

    if (params.status && (params.status as string) !== 'ALL') {
      where.status = params.status as ContentStatus;
    }
    if (params.destinationId) {
      where.destinationId = params.destinationId;
    }
    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.attraction.findMany({
      where,
      include: {
        destination: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAttraction(data: CreateAttractionInput) {
    return prisma.attraction.create({
      data: {
        destinationId: data.destinationId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        location: data.location,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        status: data.status ?? ContentStatus.DRAFT,
      },
    });
  }

  async updateAttraction(id: string, data: UpdateAttractionInput) {
    return prisma.attraction.update({
      where: { id },
      data,
    });
  }

  // ── Experiences ───────────────────────────────────────────────

  async findExperienceById(id: string) {
    return prisma.experience.findUnique({
      where: { id },
      include: {
        destination: true,
        category: true,
      },
    });
  }

  async findExperiences(params: QueryContentParams) {
    const where: Prisma.ExperienceWhereInput = {};

    if (params.status && (params.status as string) !== 'ALL') {
      where.status = params.status as ContentStatus;
    }
    if (params.destinationId) {
      where.destinationId = params.destinationId;
    }
    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.experience.findMany({
      where,
      include: {
        destination: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createExperience(data: CreateExperienceInput) {
    return prisma.experience.create({
      data: {
        destinationId: data.destinationId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        duration: data.duration,
        difficulty: data.difficulty,
        status: data.status ?? ContentStatus.DRAFT,
      },
    });
  }

  async updateExperience(id: string, data: UpdateExperienceInput) {
    return prisma.experience.update({
      where: { id },
      data,
    });
  }

  // ── Activities ────────────────────────────────────────────────

  async findActivityById(id: string) {
    return prisma.activity.findUnique({
      where: { id },
      include: {
        destination: true,
        category: true,
      },
    });
  }

  async findActivities(params: QueryContentParams) {
    const where: Prisma.ActivityWhereInput = {};

    if (params.status && (params.status as string) !== 'ALL') {
      where.status = params.status as ContentStatus;
    }
    if (params.destinationId) {
      where.destinationId = params.destinationId;
    }
    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.activity.findMany({
      where,
      include: {
        destination: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createActivity(data: CreateActivityInput) {
    return prisma.activity.create({
      data: {
        destinationId: data.destinationId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        duration: data.duration,
        status: data.status ?? ContentStatus.DRAFT,
      },
    });
  }

  async updateActivity(id: string, data: UpdateActivityInput) {
    return prisma.activity.update({
      where: { id },
      data,
    });
  }

  // ── Categories ────────────────────────────────────────────────

  async findCategories() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
