import { PrismaClient, TouristProfile, GuideProfile, HomestayProfile, ProfileDocument, VerificationStatus } from '@prisma/client';
import { prisma as defaultPrisma } from '../../database/client';

export class ProfileRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || defaultPrisma;
  }

  // ── Tourist Profile ───────────────────────────────────────────

  async findTouristProfileByUserId(userId: string): Promise<TouristProfile | null> {
    return this.prisma.touristProfile.findUnique({
      where: { userId },
    });
  }

  async createTouristProfile(data: {
    userId: string;
    fullName: string;
    profileImage?: string | null;
    dateOfBirth?: Date | null;
    gender?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;
    profileCompletion?: number;
  }): Promise<TouristProfile> {
    return this.prisma.touristProfile.create({
      data: {
        userId: data.userId,
        fullName: data.fullName,
        profileImage: data.profileImage,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        profileCompletion: data.profileCompletion ?? 0,
      },
    });
  }

  async updateTouristProfile(
    userId: string,
    data: Partial<Omit<TouristProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<TouristProfile> {
    return this.prisma.touristProfile.update({
      where: { userId },
      data,
    });
  }

  // ── Guide Profile ─────────────────────────────────────────────

  async findGuideProfileByUserId(userId: string): Promise<GuideProfile | null> {
    return this.prisma.guideProfile.findUnique({
      where: { userId },
    });
  }

  async createGuideProfile(data: {
    userId: string;
    fullName: string;
    profileImage?: string | null;
    bio?: string | null;
    experienceYears?: number;
    languages?: string[];
    specializations?: string[];
    address?: string | null;
    verificationStatus?: VerificationStatus;
    profileCompletion?: number;
  }): Promise<GuideProfile> {
    return this.prisma.guideProfile.create({
      data: {
        userId: data.userId,
        fullName: data.fullName,
        profileImage: data.profileImage,
        bio: data.bio,
        experienceYears: data.experienceYears ?? 0,
        languages: data.languages ?? [],
        specializations: data.specializations ?? [],
        address: data.address,
        verificationStatus: data.verificationStatus ?? 'UNVERIFIED',
        profileCompletion: data.profileCompletion ?? 0,
      },
    });
  }

  async updateGuideProfile(
    userId: string,
    data: Partial<Omit<GuideProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<GuideProfile> {
    return this.prisma.guideProfile.update({
      where: { userId },
      data,
    });
  }

  // ── Homestay Profile ──────────────────────────────────────────

  async findHomestayProfileByUserId(userId: string): Promise<HomestayProfile | null> {
    return this.prisma.homestayProfile.findUnique({
      where: { userId },
    });
  }

  async createHomestayProfile(data: {
    userId: string;
    propertyName: string;
    ownerName: string;
    description?: string | null;
    contactPhone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    verificationStatus?: VerificationStatus;
    profileCompletion?: number;
  }): Promise<HomestayProfile> {
    return this.prisma.homestayProfile.create({
      data: {
        userId: data.userId,
        propertyName: data.propertyName,
        ownerName: data.ownerName,
        description: data.description,
        contactPhone: data.contactPhone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        verificationStatus: data.verificationStatus ?? 'UNVERIFIED',
        profileCompletion: data.profileCompletion ?? 0,
      },
    });
  }

  async updateHomestayProfile(
    userId: string,
    data: Partial<Omit<HomestayProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<HomestayProfile> {
    return this.prisma.homestayProfile.update({
      where: { userId },
      data,
    });
  }

  // ── Profile Documents ─────────────────────────────────────────

  async createProfileDocument(data: {
    userId: string;
    documentType: string;
    documentUrl: string;
  }): Promise<ProfileDocument> {
    return this.prisma.profileDocument.create({
      data: {
        userId: data.userId,
        documentType: data.documentType,
        documentUrl: data.documentUrl,
        status: 'PENDING',
      },
    });
  }

  async findProfileDocumentsByUserId(userId: string): Promise<ProfileDocument[]> {
    return this.prisma.profileDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserWithRole(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });
  }
}

export const profileRepository = new ProfileRepository();
