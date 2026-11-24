import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TODO_COMPLETIONS_TABLE } from '../constants/index.js';

/** One finished occurrence (a calendar day) of a repeating todo. */
@Entity(TODO_COMPLETIONS_TABLE)
@Unique('todo_completions_todo_id_occurrence_date_key', [
  'todoId',
  'occurrenceDate',
])
export class TodoCompletion {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'todo_completions_pkey',
  })
  id: string;

  @Column({ name: 'todo_id', type: 'uuid' })
  todoId: string;

  /** `YYYY-MM-DD` in the user's calendar. */
  @Column({ name: 'occurrence_date', type: 'date' })
  occurrenceDate: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
