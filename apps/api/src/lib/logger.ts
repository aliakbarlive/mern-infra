import pino from 'pino';
import pinoHttp from 'pino-http';
import { isProd } from '../config/env';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
});

export const requestLogger = pinoHttp({
  logger,
});
