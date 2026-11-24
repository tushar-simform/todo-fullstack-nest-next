import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser, Public, TokenService } from '@nestjs/authentication';
import { Throttle, minutes } from '@nestjs/throttler';
import {
  AUTH_MESSAGES,
  AUTH_ROUTE,
  LOGIN_ROUTE,
  ME_ROUTE,
  THROTTLE_LOGIN_ATTEMPTS,
  THROTTLE_LOGIN_WINDOW_MINUTES,
} from '../constants/index.js';
import { toPublicUser, type PublicUser } from '../users/users.service.js';
import { accountEmail } from './account-email.js';
import { loginSchema, type LoginDto } from './auth.schema.js';
import { CredentialsService } from './credentials.service.js';

@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(
    private readonly credentials: CredentialsService,
    private readonly tokens: TokenService,
  ) {}

  @Public()
  @Post(LOGIN_ROUTE)
  @HttpCode(200)
  // Counted per email, not per IP: the web app calls this API from one server
  // address, so a per-IP limit would let one user lock out everyone.
  @Throttle({
    default: {
      limit: THROTTLE_LOGIN_ATTEMPTS,
      ttl: minutes(THROTTLE_LOGIN_WINDOW_MINUTES),
      getTracker: accountEmail,
    },
  })
  async login(@Body({ schema: loginSchema }) body: LoginDto) {
    const user = await this.credentials.verify(body.email, body.password);
    if (!user)
      throw new UnauthorizedException(AUTH_MESSAGES.invalidCredentials);

    // `refreshToken: false` => just { accessToken, expiresIn }.
    const token = await this.tokens.issue(user.id, { method: 'password' });
    return { ...token, user: toPublicUser(user) };
  }

  /** Who is the caller? Used by the frontend to validate a session. */
  @Get(ME_ROUTE)
  me(@CurrentUser() user: PublicUser): PublicUser {
    return user;
  }
}
