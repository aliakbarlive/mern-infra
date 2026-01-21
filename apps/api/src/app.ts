import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.ts';
import { requestLogger } from './lib/logger.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { authRouter } from './modules/auth/auth.routes.ts';
import { userRouter } from './modules/users/user.routes.ts';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(
  cors({
    origin: env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  }),
);

const authLimiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  max: Number(env.RATE_LIMIT_MAX),
});

app.use(requestLogger);

// Health endpoints
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/ready', (_req, res) => {
  // In a fuller implementation we'd check DB connectivity here
  res.json({ status: 'ready' });
});

// Domain modules
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/users', userRouter);

// TODO: mount posts, comments, reports, admin modules

app.use(errorHandler);

export { app };

