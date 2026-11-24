import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { USERS_TABLE } from '../constants/index.js';

@Entity(USERS_TABLE)
@Unique('users_email_key', ['email'])
export class User {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'users_pkey' })
  id: string;

  /** Stored trimmed + lowercase (see UsersService.normalizeEmail). */
  @Column({ type: 'varchar', length: 320 })
  email: string;

  /** scrypt hash from PasswordHasher. Never returned by the API. */
  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
