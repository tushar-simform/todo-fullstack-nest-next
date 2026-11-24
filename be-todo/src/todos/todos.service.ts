import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TODO_MESSAGES } from '../constants/index.js';
import { TodoCompletion } from './todo-completion.entity.js';
import { Todo } from './todo.entity.js';
import type { CreateTodoDto, UpdateTodoDto } from './todo.schema.js';

/** A todo plus the days (`YYYY-MM-DD`) a repeating todo was completed on. */
export type TodoResponse = Omit<Todo, 'repeatTime' | 'userId'> & {
  repeatTime: string | null;
  completedDates: string[];
};

/** `HH:mm:ss` from Postgres -> `HH:mm`. */
const toHourMinute = (time: string | null) => time?.slice(0, 5) ?? null;

function toResponse(todo: Todo, completedDates: string[] = []): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    isCompleted: todo.isCompleted,
    dueAt: todo.dueAt,
    hasDueTime: todo.hasDueTime,
    repeatDays: todo.repeatDays,
    repeatTime: toHourMinute(todo.repeatTime),
    repeatStartDate: todo.repeatStartDate,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    completedDates,
  };
}

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly todos: Repository<Todo>,
    @InjectRepository(TodoCompletion)
    private readonly completions: Repository<TodoCompletion>,
  ) {}

  async create(userId: string, dto: CreateTodoDto): Promise<TodoResponse> {
    const todo = await this.todos.save(
      this.todos.create({
        userId,
        title: dto.title,
        description: dto.description ?? null,
        dueAt: dto.dueAt ?? null,
        hasDueTime: dto.hasDueTime ?? false,
        repeatDays: dto.repeatDays ?? [],
        repeatTime: dto.repeatTime ?? null,
        repeatStartDate: dto.repeatStartDate ?? null,
      }),
    );
    return toResponse(todo);
  }

  async findAll(userId: string): Promise<TodoResponse[]> {
    const todos = await this.todos.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
    const repeating = todos.filter((t) => t.repeatDays.length > 0);
    const rows = repeating.length
      ? await this.completions.find({
          where: { todoId: In(repeating.map((t) => t.id)) },
        })
      : [];

    const datesByTodo = new Map<string, string[]>();
    for (const { todoId, occurrenceDate } of rows) {
      datesByTodo.set(todoId, [
        ...(datesByTodo.get(todoId) ?? []),
        occurrenceDate,
      ]);
    }
    return todos.map((t) => toResponse(t, datesByTodo.get(t.id)));
  }

  async findOne(userId: string, id: string): Promise<TodoResponse> {
    return this.withCompletions(await this.findEntity(userId, id));
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTodoDto,
  ): Promise<TodoResponse> {
    const todo = await this.findEntity(userId, id);
    const saved = await this.todos.save(Object.assign(todo, dto));
    return this.withCompletions(saved);
  }

  async remove(userId: string, id: string): Promise<void> {
    const { affected } = await this.todos.delete({ id, userId });
    if (!affected) throw new NotFoundException(TODO_MESSAGES.notFound(id));
  }

  /** Mark one day of a repeating todo done / not done (idempotent). */
  async setCompletion(
    userId: string,
    id: string,
    occurrenceDate: string,
    isCompleted: boolean,
  ): Promise<TodoResponse> {
    const todo = await this.findEntity(userId, id);
    if (isCompleted) {
      await this.completions.upsert({ todoId: id, occurrenceDate }, [
        'todoId',
        'occurrenceDate',
      ]);
    } else {
      await this.completions.delete({ todoId: id, occurrenceDate });
    }
    return this.withCompletions(todo);
  }

  /** Only finds todos owned by `userId`: other users' ids look like 404s. */
  private async findEntity(userId: string, id: string): Promise<Todo> {
    const todo = await this.todos.findOneBy({ id, userId });
    if (!todo) throw new NotFoundException(TODO_MESSAGES.notFound(id));
    return todo;
  }

  private async withCompletions(todo: Todo): Promise<TodoResponse> {
    const rows = await this.completions.find({ where: { todoId: todo.id } });
    return toResponse(
      todo,
      rows.map((r) => r.occurrenceDate),
    );
  }
}
