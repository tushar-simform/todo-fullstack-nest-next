import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds email verification and one-time codes. Users that already exist are
 * marked verified, so they can keep logging in.
 */
export class AddEmailVerification1795200000000 implements MigrationInterface {
  name = 'AddEmailVerification1795200000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "email_verified_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`UPDATE "users" SET "email_verified_at" = now()`);
    await queryRunner.query(`
      CREATE TABLE "auth_codes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "purpose" character varying(32) NOT NULL,
        "code_hash" character varying(64) NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "failed_attempts" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "auth_codes_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "auth_codes_user_id_purpose_key" UNIQUE ("user_id", "purpose"),
        CONSTRAINT "auth_codes_user_id_fkey" FOREIGN KEY ("user_id")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth_codes"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "email_verified_at"`,
    );
  }
}
