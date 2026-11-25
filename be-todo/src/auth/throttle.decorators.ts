import { SetMetadata, applyDecorators } from '@nestjs/common';
import { Throttle, minutes, seconds } from '@nestjs/throttler';
import {
  EMAIL_SEND_ROUTE_KEY,
  THROTTLER_COOLDOWN,
  THROTTLE_DEFAULT_LIMIT,
  THROTTLE_SEND_CODE_ATTEMPTS,
  THROTTLE_SEND_CODE_WINDOW_MINUTES,
  THROTTLE_SEND_COOLDOWN_SECONDS,
} from '../constants/index.js';
import { accountEmail } from './account-email.js';

/**
 * Limits a route per email address, not per IP: the web app calls this API
 * from one server address, so a per-IP limit would let one user lock out
 * everyone. A blocked request gets 429 with the exact wait in `Retry-After`.
 */
export const ThrottlePerEmail = (limit: number, windowMinutes: number) =>
  Throttle({
    default: {
      limit,
      ttl: minutes(windowMinutes),
      getTracker: accountEmail,
    },
  });

/**
 * For routes that send an email: an hourly cap plus a cooldown between sends.
 * The cooldown is a second throttler that is off for every other route (see
 * `isEmailSendRoute`); a blocked request sends `Retry-After-cooldown`, a
 * capped one `Retry-After`.
 */
export const ThrottleEmailSends = () =>
  applyDecorators(
    SetMetadata(EMAIL_SEND_ROUTE_KEY, true),
    Throttle({
      default: {
        limit: THROTTLE_SEND_CODE_ATTEMPTS,
        ttl: minutes(THROTTLE_SEND_CODE_WINDOW_MINUTES),
        getTracker: accountEmail,
      },
      [THROTTLER_COOLDOWN]: {
        limit: 1,
        ttl: seconds(THROTTLE_SEND_COOLDOWN_SECONDS),
        getTracker: accountEmail,
      },
    }),
  );

/** `skipIf` for the cooldown throttler: run it only on `@ThrottleEmailSends()` routes. */
export const isEmailSendRoute = (context: {
  getHandler: () => object;
}): boolean =>
  Reflect.getMetadata(EMAIL_SEND_ROUTE_KEY, context.getHandler()) === true;

/** The app-wide throttlers (shared by AppModule and the tests): per-IP default, plus the email cooldown. */
export const APP_THROTTLERS = [
  { name: 'default', ttl: minutes(1), limit: THROTTLE_DEFAULT_LIMIT },
  {
    name: THROTTLER_COOLDOWN,
    ttl: seconds(THROTTLE_SEND_COOLDOWN_SECONDS),
    limit: 1,
    skipIf: (context: { getHandler: () => object }) =>
      !isEmailSendRoute(context),
  },
];
