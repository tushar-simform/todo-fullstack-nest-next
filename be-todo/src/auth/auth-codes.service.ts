import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import { MoreThanOrEqual, Repository } from 'typeorm';
import {
  AUTH_CODE_LENGTH,
  AUTH_CODE_MAX_FAILED_ATTEMPTS,
  AUTH_CODE_RESEND_COOLDOWN_SECONDS,
  AUTH_CODE_TTL_MINUTES,
  type AuthCodePurpose,
} from '../constants/index.js';
import { AuthCode } from './auth-code.entity.js';

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;

/** Creates and checks the one-time codes that are sent by email. */
@Injectable()
export class AuthCodesService {
  constructor(
    @InjectRepository(AuthCode) private readonly codes: Repository<AuthCode>,
  ) {}

  /**
   * Replaces the user's code for `purpose` and returns the new plain code, or
   * `null` when one was issued less than the cooldown ago (that one is still
   * valid, so nothing more needs to be sent).
   */
  async issue(
    userId: string,
    purpose: AuthCodePurpose,
  ): Promise<string | null> {
    const now = Date.now();
    const existing = await this.codes.findOneBy({ userId, purpose });
    if (
      existing &&
      now - existing.createdAt.getTime() <
        AUTH_CODE_RESEND_COOLDOWN_SECONDS * MS_PER_SECOND
    ) {
      return null;
    }

    const code = randomInt(0, 10 ** AUTH_CODE_LENGTH)
      .toString()
      .padStart(AUTH_CODE_LENGTH, '0');
    await this.codes.upsert(
      {
        userId,
        purpose,
        codeHash: hashCode(userId, purpose, code),
        expiresAt: new Date(now + AUTH_CODE_TTL_MINUTES * MS_PER_MINUTE),
        failedAttempts: 0,
        createdAt: new Date(now),
      },
      ['userId', 'purpose'],
    );
    return code;
  }

  /**
   * True when `code` is the user's current, unexpired code. A correct code is
   * single-use. Wrong guesses are counted, and the code is deleted after too
   * many, so it can't be brute-forced.
   */
  async consume(
    userId: string,
    purpose: AuthCodePurpose,
    code: string,
  ): Promise<boolean> {
    const stored = await this.codes.findOneBy({ userId, purpose });
    if (!stored) return false;
    if (stored.expiresAt.getTime() <= Date.now()) {
      await this.codes.delete({ id: stored.id });
      return false;
    }

    if (!safeEqual(stored.codeHash, hashCode(userId, purpose, code))) {
      // Atomic increment: parallel guesses can't dodge the limit.
      await this.codes.increment({ id: stored.id }, 'failedAttempts', 1);
      await this.codes.delete({
        id: stored.id,
        failedAttempts: MoreThanOrEqual(AUTH_CODE_MAX_FAILED_ATTEMPTS),
      });
      return false;
    }

    // Only one of two simultaneous requests gets to delete the row.
    const { affected } = await this.codes.delete({ id: stored.id });
    return affected === 1;
  }
}

function hashCode(
  userId: string,
  purpose: AuthCodePurpose,
  code: string,
): string {
  return createHash('sha256')
    .update(`${userId}:${purpose}:${code}`)
    .digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
