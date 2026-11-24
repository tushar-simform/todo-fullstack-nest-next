import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds users and makes todos belong to a user. `todos.user_id` stays nullable
 * for now: existing rows are adopted by `npm run seed`; a later migration
 * should make it NOT NULL once every row has an owner.
 */
export class AddUsers1795184470219 implements MigrationInterface {
  name = 'AddUsers1795184470219';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying(320) NOT NULL,
        "password_hash" text NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "users_email_key" UNIQUE ("email")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "todos"
        ADD COLUMN "user_id" uuid,
        ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id")
          REFERENCES "users" ("id") ON DELETE CASCADE
    `);
    await queryRunner.query(
      `CREATE INDEX "todos_user_id_idx" ON "todos" ("user_id")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "todos_user_id_idx"`);
    await queryRunner.query(`
      ALTER TABLE "todos"
        DROP CONSTRAINT "todos_user_id_fkey",
        DROP COLUMN "user_id"
    `);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
