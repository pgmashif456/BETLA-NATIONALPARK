import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { ProfileRepository, profileRepository } from './profile.repository';
import {
  UpdateTouristProfileInput,
  UpdateGuideProfileInput,
  UpdateHomestayProfileInput,
  SubmitVerificationDocumentInput,
  ProfileResponseData,
  VerificationResponseData,
} from './profile.types';
import { TouristProfile, GuideProfile, HomestayProfile } from '@prisma/client';

export class ProfileService {
  private repo: ProfileRepository;

  constructor(repo?: ProfileRepository) {
    this.repo = repo || profileRepository;
  }

  // ── Unified Profile Getter ───────────────────────────────────

  async getProfileForUser(userId: string): Promise<ProfileResponseData> {
    const user = await this.repo.findUserWithRole(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const roleName = user.role.name;
    let profile: any = null;

    if (roleName === 'TOURIST') {
      profile = await this.repo.findTouristProfileByUserId(userId);
      if (!profile) {
        // Initialize default tourist profile if missing
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        profile = await this.repo.createTouristProfile({
          userId,
          fullName,
          profileCompletion: 0,
        });
      }
    } else if (roleName === 'GUIDE') {
      profile = await this.repo.findGuideProfileByUserId(userId);
      if (!profile) {
        // Initialize default guide profile if missing
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        profile = await this.repo.createGuideProfile({
          userId,
          fullName,
          profileCompletion: 0,
        });
      }
    } else if (roleName === 'HOMESTAY') {
      profile = await this.repo.findHomestayProfileByUserId(userId);
      if (!profile) {
        // Initialize default homestay profile if missing
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        const propertyName = `${user.firstName}'s Homestay`;
        profile = await this.repo.createHomestayProfile({
          userId,
          propertyName,
          ownerName: fullName,
          contactPhone: user.phone || null,
          profileCompletion: 0,
        });
      }
    } else {
      // ADMIN or FOREST_AUTHORITY
      profile = {
        userId: user.id,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        role: roleName,
      };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roleName,
      },
      stakeholderType: roleName as any,
      profile,
    };
  }

  // ── Unified Profile Patch ────────────────────────────────────

  async updateProfileForUser(userId: string, body: any): Promise<ProfileResponseData> {
    const user = await this.repo.findUserWithRole(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const roleName = user.role.name;
    if (roleName === 'TOURIST') {
      await this.updateTouristProfile(userId, body);
    } else if (roleName === 'GUIDE') {
      await this.updateGuideProfile(userId, body);
    } else if (roleName === 'HOMESTAY') {
      await this.updateHomestayProfile(userId, body);
    } else {
      throw new ValidationError('Profile updates are not supported for this role');
    }

    return this.getProfileForUser(userId);
  }

  // ── Tourist Profile Operations ──────────────────────────────

  async getTouristProfile(userId: string): Promise<TouristProfile> {
    let profile = await this.repo.findTouristProfileByUserId(userId);
    if (!profile) {
      const user = await this.repo.findUserWithRole(userId);
      if (!user) throw new NotFoundError('User not found');

      const fullName = `${user.firstName} ${user.lastName}`.trim();
      profile = await this.repo.createTouristProfile({
        userId,
        fullName,
        profileCompletion: 0,
      });
    }
    return profile;
  }

  async updateTouristProfile(userId: string, input: UpdateTouristProfileInput): Promise<TouristProfile> {
    await this.getTouristProfile(userId);

    const updatedData: any = { ...input };
    if (input.dateOfBirth) {
      updatedData.dateOfBirth = new Date(input.dateOfBirth);
    }

    return this.repo.updateTouristProfile(userId, updatedData);
  }

  // ── Guide Profile Operations ────────────────────────────────

  async getGuideProfile(userId: string): Promise<GuideProfile> {
    let profile = await this.repo.findGuideProfileByUserId(userId);
    if (!profile) {
      const user = await this.repo.findUserWithRole(userId);
      if (!user) throw new NotFoundError('User not found');

      const fullName = `${user.firstName} ${user.lastName}`.trim();
      profile = await this.repo.createGuideProfile({
        userId,
        fullName,
        profileCompletion: 0,
      });
    }
    return profile;
  }

  async updateGuideProfile(userId: string, input: UpdateGuideProfileInput): Promise<GuideProfile> {
    await this.getGuideProfile(userId);

    return this.repo.updateGuideProfile(userId, input);
  }

  async submitGuideVerification(userId: string, input: SubmitVerificationDocumentInput): Promise<VerificationResponseData> {
    const profile = await this.getGuideProfile(userId);

    // Save profile document metadata
    await this.repo.createProfileDocument({
      userId,
      documentType: input.documentType,
      documentUrl: input.documentUrl,
    });

    // Update status to PENDING if currently UNVERIFIED
    let updatedStatus = profile.verificationStatus;
    if (profile.verificationStatus === 'UNVERIFIED') {
      updatedStatus = 'PENDING';
      await this.repo.updateGuideProfile(userId, {
        verificationStatus: updatedStatus,
      });
    }

    const documents = await this.repo.findProfileDocumentsByUserId(userId);

    return {
      verificationStatus: updatedStatus,
      documents,
    };
  }

  async getGuideVerificationStatus(userId: string): Promise<VerificationResponseData> {
    const profile = await this.getGuideProfile(userId);
    const documents = await this.repo.findProfileDocumentsByUserId(userId);

    return {
      verificationStatus: profile.verificationStatus,
      documents,
    };
  }

  // ── Homestay Profile Operations ─────────────────────────────

  async getHomestayProfile(userId: string): Promise<HomestayProfile> {
    let profile = await this.repo.findHomestayProfileByUserId(userId);
    if (!profile) {
      const user = await this.repo.findUserWithRole(userId);
      if (!user) throw new NotFoundError('User not found');

      const ownerName = `${user.firstName} ${user.lastName}`.trim();
      const propertyName = `${user.firstName}'s Homestay`;

      profile = await this.repo.createHomestayProfile({
        userId,
        propertyName,
        ownerName,
        contactPhone: user.phone || null,
        profileCompletion: 0,
      });
    }
    return profile;
  }

  async updateHomestayProfile(userId: string, input: UpdateHomestayProfileInput): Promise<HomestayProfile> {
    await this.getHomestayProfile(userId);

    return this.repo.updateHomestayProfile(userId, input);
  }

  async submitHomestayVerification(userId: string, input: SubmitVerificationDocumentInput): Promise<VerificationResponseData> {
    const profile = await this.getHomestayProfile(userId);

    // Save profile document metadata
    await this.repo.createProfileDocument({
      userId,
      documentType: input.documentType,
      documentUrl: input.documentUrl,
    });

    // Update status to PENDING if currently UNVERIFIED
    let updatedStatus = profile.verificationStatus;
    if (profile.verificationStatus === 'UNVERIFIED') {
      updatedStatus = 'PENDING';
      await this.repo.updateHomestayProfile(userId, {
        verificationStatus: updatedStatus,
      });
    }

    const documents = await this.repo.findProfileDocumentsByUserId(userId);

    return {
      verificationStatus: updatedStatus,
      documents,
    };
  }

  async getHomestayVerificationStatus(userId: string): Promise<VerificationResponseData> {
    const profile = await this.getHomestayProfile(userId);
    const documents = await this.repo.findProfileDocumentsByUserId(userId);

    return {
      verificationStatus: profile.verificationStatus,
      documents,
    };
  }
}

export const profileService = new ProfileService();
