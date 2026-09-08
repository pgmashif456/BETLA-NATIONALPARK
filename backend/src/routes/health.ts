import { Router, Request, Response } from 'express';
import { prisma } from '../database/client';
import { sendSuccess, sendError } from '../common/utils/apiResponse';

const router = Router();

/**
 * GET /health/live
 * Confirms the application process is alive.
 */
router.get('/live', (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * GET /health/ready
 * Confirms that required dependencies (PostgreSQL) are reachable.
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    sendSuccess(res, {
      status: 'ready',
      timestamp: new Date().toISOString(),
      dependencies: {
        database: 'connected',
      },
    });
  } catch {
    sendError(
      res,
      'Service not ready',
      503,
      'SERVICE_UNAVAILABLE'
    );
  }
});

export default router;
