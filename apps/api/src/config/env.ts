import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  MONGO_URI: z.string().url().or(z.string().startsWith('mongodb://')),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  COOKIE_DOMAIN: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_MAX: z.string().default('100'),
  BCRYPT_SALT_ROUNDS: z.string().default('10'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

export const isProd =false;
