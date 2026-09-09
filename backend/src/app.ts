import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { config } from './config';
import {
  requestIdMiddleware,
  requestLogger,
  errorHandler,
  notFoundHandler,
} from './common/middleware';

import healthRoutes from './routes/health';
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import contentRoutes from './modules/content/content.routes';
import safetyRoutes from './modules/safety/safety.routes';
import ecoRoutes from './modules/eco/eco.routes';
import bookingRoutes from './modules/booking/booking.routes';
import communicationRoutes from './modules/communication/communication.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// ── Security Headers ────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────
const rawCorsOrigin = config.cors.origin || '';
const allowedOrigins = rawCorsOrigin
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools without origin header
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        allowedOrigins.includes('*') ||
        (config.nodeEnv !== 'production' && normalizedOrigin.includes('localhost'))
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  })
);

// ── Global Rate Limit ───────────────────────────────────────
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later',
      },
    },
  })
);

// ── Body Parsing ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request ID ──────────────────────────────────────────────
app.use(requestIdMiddleware);

// ── Request Logging ─────────────────────────────────────────
app.use(requestLogger);

// ── Trust Proxy (for rate limiting behind reverse proxy) ────
app.set('trust proxy', 1);

// ══════════════════════════════════════════════════════════════
//  ROUTES
// ══════════════════════════════════════════════════════════════

// Health checks
app.use('/health', healthRoutes);

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1', contentRoutes);
app.use('/api/v1', safetyRoutes);
app.use('/api/v1', ecoRoutes);
app.use('/api/v1', bookingRoutes);
app.use('/api/v1', communicationRoutes);
app.use('/api/v1', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);




// ── 404 Handler ─────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

export default app;
