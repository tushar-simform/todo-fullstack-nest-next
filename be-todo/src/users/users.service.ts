import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

/** What the API may expose about a user (never the password hash). */
export type PublicUser = Pick<User, 'id' | 'email'>;

export const toPublicUser = ({ id, email }: User): PublicUser => ({
  id,
  email,
});

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  static normalizeEmail(email: string): string {
    return email.trim().normalize('NFC').toLowerCase();
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email: UsersService.normalizeEmail(email) });
  }

  create(email: string, passwordHash: string): Promise<User> {
    return this.users.save(
      this.users.create({
        email: UsersService.normalizeEmail(email),
        passwordHash,
      }),
    );
  }
}
