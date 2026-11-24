import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TODO_TITLE_MAX_LENGTH, TODOS_TABLE } from '../constants/index.js';

@Entity(TODOS_TABLE)
export class Todo {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'todos_pkey' })
  id: string;

  @Column({ type: 'varchar', length: TODO_TITLE_MAX_LENGTH })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  /** When the todo is due (UTC). Null = no due date. */
  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt: Date | null;

  /** False = date-only (due by end of that day); true = a specific time. */
  @Column({ name: 'has_due_time', type: 'boolean', default: false })
  hasDueTime: boolean;

  /** Weekdays (0 = Sun ... 6 = Sat) this todo repeats on. Empty = one-time. */
  @Column({
    name: 'repeat_days',
    type: 'smallint',
    array: true,
    default: () => "'{}'",
  })
  repeatDays: number[];

  /** Local time of day (`HH:mm:ss`) for repeating todos; null = all day. */
  @Column({ name: 'repeat_time', type: 'time', nullable: true })
  repeatTime: string | null;

  /** First day a repeating todo applies (`YYYY-MM-DD`). */
  @Column({ name: 'repeat_start_date', type: 'date', nullable: true })
  repeatStartDate: string | null;

  /** Owner. Every todo query is scoped to the signed-in user. */
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
