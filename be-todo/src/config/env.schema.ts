import { z } from 'zod';
import {
  DEFAULT_JWT_TTL,
  DEFAULT_MAIL_FROM,
  DEFAULT_PORT,
  JWT_SECRET_MIN_LENGTH,
  MAIL_TRANSPORT,
} from '../constants/index.js';

export const envSchema = z
  .object({
    NODE_ENV: z.string().optional(),
    PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
    JWT_SECRET: z
      .string()
      .min(JWT_SECRET_MIN_LENGTH)
      .refine((v) => !v.startsWith('replace-with'), {
        message: 'JWT_SECRET is still the placeholder; generate a real one',
      }),
    /** Access token lifetime, e.g. '15m', '7d'. */
    JWT_TTL: z.string().default(DEFAULT_JWT_TTL),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    MAIL_TRANSPORT: z
      .enum([MAIL_TRANSPORT.log, MAIL_TRANSPORT.smtp])
      .default(MAIL_TRANSPORT.log),
    /** e.g. smtps://user:app-password@smtp.gmail.com:465 (required for `smtp`). */
    SMTP_URL: z.string().optional(),
    MAIL_FROM: z.string().default(DEFAULT_MAIL_FROM),
  })
  .refine(
    (env) =>
      env.NODE_ENV !== 'production' || env.MAIL_TRANSPORT === MAIL_TRANSPORT.smtp,
    {
      path: ['MAIL_TRANSPORT'],
      message:
        'MAIL_TRANSPORT must be "smtp" in production (the "log" transport prints codes to the server log)',
    },
  )
  .refine((env) => env.MAIL_TRANSPORT !== MAIL_TRANSPORT.smtp || env.SMTP_URL, {
    path: ['SMTP_URL'],
    message: 'SMTP_URL is required when MAIL_TRANSPORT is "smtp"',
  });

export type Env = z.infer<typeof envSchema>;
