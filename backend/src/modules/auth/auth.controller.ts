import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendSuccess } from '../../common/utils/apiResponse';
import { ValidationError } from '../../common/errors/AppError';
import { AuthenticatedRequest } from '../../common/types';
import { authService, AuthService } from './auth.service';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
} from './auth.validation';

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

export class AuthController {
  private service: AuthService;

  constructor(service?: AuthService) {
    this.service = service || authService;
  }

  /**
   * POST /api/v1/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(registerSchema, req.body);
      const result = await this.service.register(input);

      sendSuccess(res, {
        user: result.user,
        message: 'Registration successful. Please verify your email.',
        // Include token in dev/test mode for easy testing
        ...(['development', 'test'].includes(process.env.NODE_ENV as string) && { verificationToken: result.verificationToken }),
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(loginSchema, req.body);
      const result = await this.service.login(input, {
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
      });

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/logout
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await this.service.logout(refreshToken);
      }
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/refresh
   */
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(refreshTokenSchema, req.body);
      const tokens = await this.service.refreshTokens(input.refreshToken, {
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
      });

      sendSuccess(res, tokens);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/verify
   */
  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(verifyEmailSchema, req.body);
      const result = await this.service.verifyEmail(input.token);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(forgotPasswordSchema, req.body);
      const result = await this.service.forgotPassword(input.email);

      sendSuccess(res, {
        message: result.message,
        // Include token in dev/test mode for easy testing
        ...(['development', 'test'].includes(process.env.NODE_ENV as string) && result.resetToken && { resetToken: result.resetToken }),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(resetPasswordSchema, req.body);
      const result = await this.service.resetPassword(input.token, input.newPassword);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/change-password
   */
  changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(changePasswordSchema, req.body);
      const result = await this.service.changePassword(req.user!.id, input);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/me
   */
  me = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.getCurrentUser(req.user!.id);
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
