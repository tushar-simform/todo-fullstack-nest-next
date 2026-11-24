import { z } from 'zod';
import {
  DEFAULT_JWT_TTL,
  DEFAULT_PORT,
  JWT_SECRET_MIN_LENGTH,
} from '../constants/index.js';

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  JWT_SECRET: z.string().min(JWT_SECRET_MIN_LENGTH),
  /** Access token lifetime, e.g. '15m', '7d'. */
  JWT_TTL: z.string().default(DEFAULT_JWT_TTL),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

export type Env = z.infer<typeof envSchema>;
