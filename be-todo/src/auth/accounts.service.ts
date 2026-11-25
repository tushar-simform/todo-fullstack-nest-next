import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { QueryFailedError } from 'typeorm';
import {
  AUTH_CODE_PURPOSE,
  AUTH_MESSAGES,
  PG_UNIQUE_VIOLATION,
  type AuthCodePurpose,
} from '../constants/index.js';
import type { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthCodesService } from './auth-codes.service.js';
import { AuthMailService } from './auth-mail.service.js';

/** Sign-up, email verification and password reset. */
@Injectable()
export class AccountsService {
  constructor(
    private readonly users: UsersService,
    private readonly codes: AuthCodesService,
    private readonly mail: AuthMailService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /**
   * Creates an unverified account and emails its verification code. An email
   * that is registered but never verified is taken over (new password, new
   * code): its owner was never proven, and the code still goes to the real
   * mailbox, so nobody gains access to someone else's address this way.
   * Throws 409 when the email belongs to a verified account.
   */
  async register(email: string, password: string): Promise<User> {
    const passwordHash = await this.passwordHasher.hash(password);
    let user: User;
    try {
      // Insert and rely on the unique constraint instead of "find, then
      // insert": two simultaneous signups can't both pass a check.
      user = await this.users.create(email, passwordHash);
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      const existing = await this.users.findByEmail(email);
      if (!existing || existing.emailVerifiedAt)
        throw new ConflictException(AUTH_MESSAGES.emailTaken);
      user = await this.users.setPasswordHash(existing, passwordHash);
    }
    await this.sendCode(user, AUTH_CODE_PURPOSE.emailVerification);
    return user;
  }

  /** Checks the emailed code and verifies the account. 400 for any bad code. */
  async verifyEmail(email: string, code: string): Promise<User> {
    const user = await this.users.findByEmail(email);
    if (
      !user ||
      !(await this.codes.consume(
        user.id,
        AUTH_CODE_PURPOSE.emailVerification,
        code,
      ))
    )
      throw new BadRequestException(AUTH_MESSAGES.invalidCode);
    return this.users.markEmailVerified(user);
  }

  /** Sends a fresh code to an unverified account. Silent for any other email. */
  async resendVerification(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (user && !user.emailVerifiedAt)
      await this.sendCode(user, AUTH_CODE_PURPOSE.emailVerification);
  }

  /** Sends a reset code. Silent for unknown emails (no account enumeration). */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (user) await this.sendCode(user, AUTH_CODE_PURPOSE.passwordReset);
  }

  /**
   * Sets a new password with the emailed code. The code proves the mailbox, so
   * an unverified account becomes verified too. 400 for any bad code.
   */
  async resetPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (
      !user ||
      !(await this.codes.consume(
        user.id,
        AUTH_CODE_PURPOSE.passwordReset,
        code,
      ))
    )
      throw new BadRequestException(AUTH_MESSAGES.invalidCode);
    await this.users.setPasswordHash(
      user,
      await this.passwordHasher.hash(password),
      {
        verifyEmail: true,
      },
    );
  }

  private async sendCode(user: User, purpose: AuthCodePurpose): Promise<void> {
    const code = await this.codes.issue(user.id, purpose);
    if (!code) return; // one was sent moments ago and is still valid
    if (purpose === AUTH_CODE_PURPOSE.emailVerification)
      this.mail.sendVerificationCode(user.email, code);
    else this.mail.sendPasswordResetCode(user.email, code);
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code ===
      PG_UNIQUE_VIOLATION
  );
}
