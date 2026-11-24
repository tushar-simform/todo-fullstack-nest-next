export const AUTH_ROUTE = 'auth';
export const LOGIN_ROUTE = 'login';
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
