import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  if (err instanceof AppError && err.isOperational) {
    logger.warn('Operational error', {
      requestId: req.requestId,
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });
  } else {
    logger.error('Unexpected error', {
      requestId: req.requestId,
      message: err.message,
      stack: err.stack,
    });
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError' || err.constructor?.name === 'ZodError') {
    const zodErr = err as any;
    const details: Record<string, string[]> = {};
    if (Array.isArray(zodErr.errors)) {
      zodErr.errors.forEach((e: any) => {
        const field = e.path?.join('.') || 'body';
        if (!details[field]) details[field] = [];
        details[field].push(e.message);
      });
    }
    sendError(res, 'Validation failed', 400, 'VALIDATION_ERROR', details);
    return;
  }

  // Handle known operational errors
  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code);
    return;
  }

  if ((err as any).statusCode && (err as any).message) {
    const status = (err as any).statusCode;
    const code = (err as any).code || 'ERROR';
    sendError(res, (err as any).message, status, code);
    return;
  }


  // Handle Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      sendError(res, 'A record with this value already exists', 409, 'CONFLICT');
      return;
    }
    if (prismaErr.code === 'P2025') {
      sendError(res, 'Record not found', 404, 'NOT_FOUND');
      return;
    }
  }

  // Handle JSON parse errors
  if ((err as any).type === 'entity.parse.failed') {
    sendError(res, 'Invalid JSON in request body', 400, 'INVALID_JSON');
    return;
  }

  // Generic fallback — never leak stack trace
  sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
    500,
    'INTERNAL_ERROR'
  );
}
