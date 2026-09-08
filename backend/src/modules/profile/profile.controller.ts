import { Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendSuccess } from '../../common/utils/apiResponse';
import { ValidationError, ForbiddenError } from '../../common/errors/AppError';
import { AuthenticatedRequest } from '../../common/types';
import { ProfileService, profileService } from './profile.service';
import {
  updateTouristProfileSchema,
  updateGuideProfileSchema,
  updateHomestayProfileSchema,
  submitVerificationDocumentSchema,
} from './profile.validation';

function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.') || 'body';
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }
    throw new ValidationError('Validation failed', details);
  }
  return result.data;
}

export class ProfileController {
  private service: ProfileService;

  constructor(service?: ProfileService) {
    this.service = service || profileService;
  }

  /**
   * GET /api/v1/profile
   */
  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getProfileForUser(req.user!.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/v1/profile
   */
  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.updateProfileForUser(req.user!.id, req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/tourist/profile
   */
  getTouristProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'TOURIST' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only tourists can access tourist profiles');
      }
      const profile = await this.service.getTouristProfile(req.user!.id);
      sendSuccess(res, { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/v1/tourist/profile
   */
  updateTouristProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'TOURIST' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only tourists can update tourist profiles');
      }
      const input = validate(updateTouristProfileSchema, req.body);
      const profile = await this.service.updateTouristProfile(req.user!.id, input);
      sendSuccess(res, { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/guide/profile
   */
  getGuideProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'GUIDE' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only guides can access guide profiles');
      }
      const profile = await this.service.getGuideProfile(req.user!.id);
      sendSuccess(res, { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/v1/guide/profile
   */
  updateGuideProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'GUIDE' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only guides can update guide profiles');
      }
      const input = validate(updateGuideProfileSchema, req.body);
      const profile = await this.service.updateGuideProfile(req.user!.id, input);
      sendSuccess(res, { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/guide/profile/verification
   */
  submitGuideVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'GUIDE' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only guides can submit guide verification documents');
      }
      const input = validate(submitVerificationDocumentSchema, req.body);
      const result = await this.service.submitGuideVerification(req.user!.id, input);
      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/guide/profile/verification
   */
  getGuideVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'GUIDE' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only guides can access guide verification status');
      }
      const result = await this.service.getGuideVerificationStatus(req.user!.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/homestay/profile
   */
  getHomestayProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'HOMESTAY' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only homestay owners can access homestay profiles');
      }
      const profile = await this.service.getHomestayProfile(req.user!.id);
      sendSuccess(res, { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/v1/homestay/profile
   */
  updateHomestayProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'HOMESTAY' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only homestay owners can update homestay profiles');
      }
      const input = validate(updateHomestayProfileSchema, req.body);
      const profile = await this.service.updateHomestayProfile(req.user!.id, input);
      sendSuccess(res, { profile });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/homestay/profile/verification
   */
  submitHomestayVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'HOMESTAY' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only homestay owners can submit homestay verification documents');
      }
      const input = validate(submitVerificationDocumentSchema, req.body);
      const result = await this.service.submitHomestayVerification(req.user!.id, input);
      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/homestay/profile/verification
   */
  getHomestayVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'HOMESTAY' && req.user!.role !== 'ADMIN') {
        throw new ForbiddenError('Only homestay owners can access homestay verification status');
      }
      const result = await this.service.getHomestayVerificationStatus(req.user!.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}

export const profileController = new ProfileController();
