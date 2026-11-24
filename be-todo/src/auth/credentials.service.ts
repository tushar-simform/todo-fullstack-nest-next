import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import type { User } from '../users/user.entity.js';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly users: UsersService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /** The user, or `null` when the email or password is wrong. */
  async verify(email: string, password: string): Promise<User | null> {
    const user = await this.users.findByEmail(email);
    // With no account, verify() checks a dummy hash, so response time doesn't
    // reveal which emails are registered.
    const valid = await this.passwordHasher.verify(
      password,
      user?.passwordHash,
    );
    return valid && user ? user : null;
  }
}
