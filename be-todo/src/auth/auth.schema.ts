import { z } from 'zod';
import {
  AUTH_CODE_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../constants/index.js';

/** Sign-in doesn't enforce password rules, so older passwords keep working. */
export const loginSchema = z.object({
  email: z.email().max(320),
  password: z.string().min(1).max(128),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email().max(320),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

const emailField = z.email().max(320);
const codeField = z.string().regex(new RegExp(`^\\d{${AUTH_CODE_LENGTH}}$`));
const newPasswordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .max(PASSWORD_MAX_LENGTH);

export const verifyEmailSchema = z.object({
  email: emailField,
  code: codeField,
});
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;

/** Used by both resend-verification and forgot-password. */
export const emailOnlySchema = z.object({ email: emailField });
export type EmailOnlyDto = z.infer<typeof emailOnlySchema>;

export const resetPasswordSchema = z.object({
  email: emailField,
  code: codeField,
  password: newPasswordField,
});
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

export type RegisterDto = z.infer<typeof registerSchema>;
