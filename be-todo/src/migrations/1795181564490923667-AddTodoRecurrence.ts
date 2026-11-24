import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodoRecurrence1795181564490923667 implements MigrationInterface {
  name = 'AddTodoRecurrence1795181564490923667';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todos"
        ADD COLUMN "repeat_days" smallint[] NOT NULL DEFAULT '{}',
        ADD COLUMN "repeat_time" time,
        ADD COLUMN "repeat_start_date" date
    `);
    await queryRunner.query(`
      CREATE TABLE "todo_completions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "todo_id" uuid NOT NULL,
        "occurrence_date" date NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "todo_completions_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "todo_completions_todo_id_occurrence_date_key" UNIQUE ("todo_id", "occurrence_date"),
        CONSTRAINT "todo_completions_todo_id_fkey" FOREIGN KEY ("todo_id") REFERENCES "todos" ("id") ON DELETE CASCADE
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "todo_completions"`);
    await queryRunner.query(`
      ALTER TABLE "todos"
        DROP COLUMN "repeat_start_date",
        DROP COLUMN "repeat_time",
        DROP COLUMN "repeat_days"
    `);
  }
}
