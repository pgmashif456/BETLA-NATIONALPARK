import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UnauthorizedError, ForbiddenError } from '../../common/errors/AppError';
import { AccessTokenPayload } from './auth.types';
import { AUTH_ERRORS } from './auth.constants';
import { AuthenticatedRequest } from '../../common/types';

/**
 * Authentication middleware — verifies JWT access token
 */
export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(AUTH_ERRORS.UNAUTHORIZED.message, AUTH_ERRORS.UNAUTHORIZED.code);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError(AUTH_ERRORS.UNAUTHORIZED.message, AUTH_ERRORS.UNAUTHORIZED.code);
    }

    const payload = jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;

    if (payload.type !== 'access') {
      throw new UnauthorizedError(AUTH_ERRORS.INVALID_TOKEN.message, AUTH_ERRORS.INVALID_TOKEN.code);
    }

    // Attach user to request
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      next(error);
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError(AUTH_ERRORS.TOKEN_EXPIRED.message, AUTH_ERRORS.TOKEN_EXPIRED.code));
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError(AUTH_ERRORS.INVALID_TOKEN.message, AUTH_ERRORS.INVALID_TOKEN.code));
      return;
    }
    next(new UnauthorizedError(AUTH_ERRORS.UNAUTHORIZED.message, AUTH_ERRORS.UNAUTHORIZED.code));
  }
}

/**
 * Optional authentication middleware — populates req.user if Bearer token present, but does not error if absent
 */
export function optionalAuthenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const payload = jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;

    if (payload.type === 'access') {
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
      };
    }

    next();
  } catch {
    // Ignore invalid tokens for optional authentication
    next();
  }
}


/**
 * Role-based authorization middleware
 */
export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError(AUTH_ERRORS.UNAUTHORIZED.message, AUTH_ERRORS.UNAUTHORIZED.code));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError(AUTH_ERRORS.FORBIDDEN.message, AUTH_ERRORS.FORBIDDEN.code));
      return;
    }

    next();
  };
}

/**
 * Permission-based authorization middleware
 */
export function requirePermission(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError(AUTH_ERRORS.UNAUTHORIZED.message, AUTH_ERRORS.UNAUTHORIZED.code));
      return;
    }

    const hasAllPermissions = requiredPermissions.every((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasAllPermissions) {
      next(new ForbiddenError(AUTH_ERRORS.FORBIDDEN.message, AUTH_ERRORS.FORBIDDEN.code));
      return;
    }

    next();
  };
}

/**
 * Require any one of the specified permissions
 */
export function requireAnyPermission(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError(AUTH_ERRORS.UNAUTHORIZED.message, AUTH_ERRORS.UNAUTHORIZED.code));
      return;
    }

    const hasAnyPermission = requiredPermissions.some((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasAnyPermission) {
      next(new ForbiddenError(AUTH_ERRORS.FORBIDDEN.message, AUTH_ERRORS.FORBIDDEN.code));
      return;
    }

    next();
  };
}
