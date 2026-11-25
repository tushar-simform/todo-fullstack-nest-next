import { Injectable, Logger } from '@nestjs/common';
import { Mailer } from '@nestjs/mail';
import {
  passwordResetEmail,
  verificationEmail,
  type AuthEmail,
} from './auth-emails.js';

/**
 * Sends the auth emails (see `auth-emails.ts` for their content). Delivery is
 * fire-and-forget: the request must not wait for the mail server, or response
 * time would reveal whether an account exists. Failures are logged (the user
 * can ask for a new code).
 */
@Injectable()
export class AuthMailService {
  private readonly logger = new Logger(AuthMailService.name);

  constructor(private readonly mailer: Mailer) {}

  sendVerificationCode(to: string, code: string): void {
    this.deliver(to, verificationEmail(code));
  }

  sendPasswordResetCode(to: string, code: string): void {
    this.deliver(to, passwordResetEmail(code));
  }

  private deliver(to: string, email: AuthEmail): void {
    this.mailer.send({ to, ...email }).catch((error: unknown) => {
      this.logger.error(`Could not send "${email.subject}" email`, error);
    });
  }
}
