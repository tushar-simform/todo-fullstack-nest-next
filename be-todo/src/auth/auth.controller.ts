import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser, Public, TokenService } from '@nestjs/authentication';
import {
  AUTH_MESSAGES,
  AUTH_ROUTE,
  EMAIL_NOT_VERIFIED_CODE,
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  ME_ROUTE,
  REGISTER_ROUTE,
  RESEND_VERIFICATION_ROUTE,
  RESET_PASSWORD_ROUTE,
  THROTTLE_CODE_ATTEMPTS,
  THROTTLE_CODE_WINDOW_MINUTES,
  THROTTLE_LOGIN_ATTEMPTS,
  THROTTLE_LOGIN_WINDOW_MINUTES,
  VERIFY_EMAIL_ROUTE,
} from '../constants/index.js';
import { toPublicUser, type PublicUser } from '../users/users.service.js';
import { AccountsService } from './accounts.service.js';
import {
  emailOnlySchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  type EmailOnlyDto,
  type LoginDto,
  type RegisterDto,
  type ResetPasswordDto,
  type VerifyEmailDto,
} from './auth.schema.js';
import { CredentialsService } from './credentials.service.js';
import { ThrottleEmailSends, ThrottlePerEmail } from './throttle.decorators.js';

@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(
    private readonly credentials: CredentialsService,
    private readonly accounts: AccountsService,
    private readonly tokens: TokenService,
  ) {}

  @Public()
  @Post(LOGIN_ROUTE)
  @HttpCode(200)
  @ThrottlePerEmail(THROTTLE_LOGIN_ATTEMPTS, THROTTLE_LOGIN_WINDOW_MINUTES)
  async login(@Body({ schema: loginSchema }) body: LoginDto) {
    const user = await this.credentials.verify(body.email, body.password);
    if (!user)
      throw new UnauthorizedException(AUTH_MESSAGES.invalidCredentials);

    // Only after the password is right, so this can't reveal which emails exist.
    if (!user.emailVerifiedAt) {
      await this.accounts.resendVerification(user.email);
      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden',
        message: AUTH_MESSAGES.emailNotVerified,
        code: EMAIL_NOT_VERIFIED_CODE,
      });
    }

    // `refreshToken: false` => just { accessToken, expiresIn }.
    const token = await this.tokens.issue(user.id, { method: 'password' });
    return { ...token, user: toPublicUser(user) };
  }

  /** Creates an unverified account and emails a code; sign-in happens at verify-email. */
  @Public()
  @Post(REGISTER_ROUTE)
  @ThrottleEmailSends()
  async register(@Body({ schema: registerSchema }) body: RegisterDto) {
    const user = await this.accounts.register(body.email, body.password);
    return { email: user.email };
  }

  /** Checks the emailed code, verifies the account and signs it in. */
  @Public()
  @Post(VERIFY_EMAIL_ROUTE)
  @HttpCode(200)
  @ThrottlePerEmail(THROTTLE_CODE_ATTEMPTS, THROTTLE_CODE_WINDOW_MINUTES)
  async verifyEmail(@Body({ schema: verifyEmailSchema }) body: VerifyEmailDto) {
    const user = await this.accounts.verifyEmail(body.email, body.code);
    const token = await this.tokens.issue(user.id, { method: 'email_code' });
    return { ...token, user: toPublicUser(user) };
  }

  /** Always 204, whether or not the email has an unverified account. */
  @Public()
  @Post(RESEND_VERIFICATION_ROUTE)
  @HttpCode(204)
  @ThrottleEmailSends()
  async resendVerification(
    @Body({ schema: emailOnlySchema }) body: EmailOnlyDto,
  ) {
    await this.accounts.resendVerification(body.email);
  }

  /** Always 204, whether or not the email has an account. */
  @Public()
  @Post(FORGOT_PASSWORD_ROUTE)
  @HttpCode(204)
  @ThrottleEmailSends()
  async forgotPassword(@Body({ schema: emailOnlySchema }) body: EmailOnlyDto) {
    await this.accounts.forgotPassword(body.email);
  }

  @Public()
  @Post(RESET_PASSWORD_ROUTE)
  @HttpCode(204)
  @ThrottlePerEmail(THROTTLE_CODE_ATTEMPTS, THROTTLE_CODE_WINDOW_MINUTES)
  async resetPassword(
    @Body({ schema: resetPasswordSchema }) body: ResetPasswordDto,
  ) {
    await this.accounts.resetPassword(body.email, body.code, body.password);
  }

  /** Who is the caller? Used by the frontend to validate a session. */
  @Get(ME_ROUTE)
  me(@CurrentUser() user: PublicUser): PublicUser {
    return user;
  }
}
