import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodoDueDate1795181018754 implements MigrationInterface {
  name = 'AddTodoDueDate1795181018754';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todos"
        ADD COLUMN "due_at" TIMESTAMP WITH TIME ZONE,
        ADD COLUMN "has_due_time" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(
      `CREATE INDEX "todos_due_at_idx" ON "todos" ("due_at")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "todos_due_at_idx"`);
    await queryRunner.query(`
      ALTER TABLE "todos"
        DROP COLUMN "has_due_time",
        DROP COLUMN "due_at"
    `);
  }
}
