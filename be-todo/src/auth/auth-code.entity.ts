import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AUTH_CODES_TABLE } from '../constants/index.js';

/** The one active emailed code per user and purpose (a new code replaces the old). */
@Entity(AUTH_CODES_TABLE)
@Unique('auth_codes_user_id_purpose_key', ['userId', 'purpose'])
export class AuthCode {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'auth_codes_pkey',
  })
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  /** See AUTH_CODE_PURPOSE. */
  @Column({ type: 'varchar', length: 32 })
  purpose: string;

  /** SHA-256 of the code (the plain code only ever exists in the email). */
  @Column({ name: 'code_hash', type: 'varchar', length: 64 })
  codeHash: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'failed_attempts', type: 'int', default: 0 })
  failedAttempts: number;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
