export const AUTH_ROUTE = 'auth';
export const LOGIN_ROUTE = 'login';
export const REGISTER_ROUTE = 'register';
export const VERIFY_EMAIL_ROUTE = 'verify-email';
export const RESEND_VERIFICATION_ROUTE = 'resend-verification';
export const FORGOT_PASSWORD_ROUTE = 'forgot-password';
export const RESET_PASSWORD_ROUTE = 'reset-password';
export const ME_ROUTE = 'me';

export const DEFAULT_JWT_TTL = '7d';
export const JWT_ISSUER = 'be-todo';
export const JWT_AUDIENCE = 'fe-todo';
export const JWT_SECRET_MIN_LENGTH = 32;

export const USERS_TABLE = 'users';

/** Login rate limits (see ThrottlerModule in AppModule). */
export const THROTTLE_DEFAULT_LIMIT = 300;
export const THROTTLE_LOGIN_ATTEMPTS = 10;
export const THROTTLE_LOGIN_WINDOW_MINUTES = 15;

/** New passwords only; sign-in accepts anything so older passwords keep working. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** PostgreSQL error code for a unique-constraint violation. */
export const PG_UNIQUE_VIOLATION = '23505';

/** One-time email codes (verify email, reset password). */
export const AUTH_CODES_TABLE = 'auth_codes';
export const AUTH_CODE_LENGTH = 6;
export const AUTH_CODE_TTL_MINUTES = 10;
/** Wrong guesses allowed before the code is thrown away (6 digits is brute-forceable). */
export const AUTH_CODE_MAX_FAILED_ATTEMPTS = 5;
/** A new code is not sent (or replaced) within this time of the last one. */
export const AUTH_CODE_RESEND_COOLDOWN_SECONDS = 60;

export const AUTH_CODE_PURPOSE = {
  emailVerification: 'email_verification',
  passwordReset: 'password_reset',
} as const;
export type AuthCodePurpose =
  (typeof AUTH_CODE_PURPOSE)[keyof typeof AUTH_CODE_PURPOSE];

/** Error `code` in the 403 body of login for an account that is not verified yet. */
export const EMAIL_NOT_VERIFIED_CODE = 'EMAIL_NOT_VERIFIED';

/** Per-email throttles for the code endpoints. */
export const THROTTLE_CODE_ATTEMPTS = 10;
export const THROTTLE_CODE_WINDOW_MINUTES = 15;
/**
 * Routes that send an email (register, resend-verification, forgot-password):
 * at most this many per email per window, and never twice within the cooldown.
 * Counted per email address, whether or not an account exists, so the answer
 * never reveals which emails are registered.
 */
export const THROTTLE_SEND_CODE_ATTEMPTS = 5;
export const THROTTLE_SEND_CODE_WINDOW_MINUTES = 60;
export const THROTTLE_SEND_COOLDOWN_SECONDS = 60;
/** Name of the second throttler (see AppModule) and the route marker that enables it. */
export const THROTTLER_COOLDOWN = 'cooldown';
export const EMAIL_SEND_ROUTE_KEY = 'auth:email-send-route';
