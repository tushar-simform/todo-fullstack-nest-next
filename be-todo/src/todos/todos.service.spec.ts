import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { TodoCompletion } from './todo-completion.entity.js';
import type { Todo } from './todo.entity.js';
import { TodosService } from './todos.service.js';

const USER = 'user-1';

describe('TodosService', () => {
  let repo: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let completions: {
    find: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let service: TodosService;

  beforeEach(() => {
    repo = {
      create: vi.fn((v) => v),
      save: vi.fn((v) => Promise.resolve(v)),
      find: vi.fn(),
      findOneBy: vi.fn(),
      delete: vi.fn(),
    };
    completions = {
      find: vi.fn().mockResolvedValue([]),
      upsert: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    service = new TodosService(
      repo as unknown as Repository<Todo>,
      completions as unknown as Repository<TodoCompletion>,
    );
  });

  it('creates a one-time todo with defaults', async () => {
    await service.create(USER, { title: 'a' });
    expect(repo.create).toHaveBeenCalledWith({
      userId: USER,
      title: 'a',
      description: null,
      dueAt: null,
      hasDueTime: false,
      repeatDays: [],
      repeatTime: null,
      repeatStartDate: null,
    });
    expect(repo.save).toHaveBeenCalled();
  });

  it('creates a todo with a due date and time', async () => {
    const dueAt = new Date('2026-12-01T10:00:00.000Z');
    await service.create(USER, { title: 'a', dueAt, hasDueTime: true });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ dueAt, hasDueTime: true }),
    );
  });

  it('creates a repeating todo and trims the time to HH:mm', async () => {
    repo.save.mockImplementation((v) =>
      Promise.resolve({ ...v, repeatTime: '09:00:00' }),
    );
    const todo = await service.create(USER, {
      title: 'gym',
      repeatDays: [1, 3, 5],
      repeatTime: '09:00',
      repeatStartDate: '2026-11-23',
    });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ repeatDays: [1, 3, 5], repeatTime: '09:00' }),
    );
    expect(todo.repeatTime).toBe('09:00');
    expect(todo.completedDates).toEqual([]);
  });

  it('findAll attaches completed dates to repeating todos only', async () => {
    repo.find.mockResolvedValue([
      { id: '1', repeatDays: [] },
      { id: '2', repeatDays: [1] },
    ]);
    completions.find.mockResolvedValue([
      { todoId: '2', occurrenceDate: '2026-11-23' },
    ]);
    const result = await service.findAll(USER);
    expect(result[0].completedDates).toEqual([]);
    expect(result[1].completedDates).toEqual(['2026-11-23']);
    expect(completions.find).toHaveBeenCalledTimes(1);
  });

  it('findOne throws when missing', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(USER, 'x')).rejects.toThrow(NotFoundException);
  });

  it('update merges fields onto the existing todo', async () => {
    repo.findOneBy.mockResolvedValue({
      id: '1',
      title: 'a',
      isCompleted: false,
    });
    const updated = await service.update(USER, '1', { isCompleted: true });
    expect(updated).toMatchObject({ title: 'a', isCompleted: true });
  });

  it('remove throws when nothing was deleted', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(USER, 'x')).rejects.toThrow(NotFoundException);
    repo.delete.mockResolvedValue({ affected: 1 });
    await expect(service.remove(USER, 'x')).resolves.toBeUndefined();
  });

  it('setCompletion upserts when completing and deletes when undoing', async () => {
    repo.findOneBy.mockResolvedValue({ id: '1', repeatDays: [1] });
    await service.setCompletion(USER, '1', '2026-11-23', true);
    expect(completions.upsert).toHaveBeenCalledWith(
      { todoId: '1', occurrenceDate: '2026-11-23' },
      ['todoId', 'occurrenceDate'],
    );
    await service.setCompletion(USER, '1', '2026-11-23', false);
    expect(completions.delete).toHaveBeenCalledWith({
      todoId: '1',
      occurrenceDate: '2026-11-23',
    });
  });

  it('setCompletion throws for an unknown todo', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(
      service.setCompletion(USER, 'x', '2026-11-23', true),
    ).rejects.toThrow(NotFoundException);
  });

  it('scopes every lookup to the signed-in user', async () => {
    repo.find.mockResolvedValue([]);
    await service.findAll(USER);
    expect(repo.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: USER } }),
    );

    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(USER, 'other-users-todo')).rejects.toThrow(
      NotFoundException,
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: 'other-users-todo',
      userId: USER,
    });

    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(USER, 'other-users-todo')).rejects.toThrow(
      NotFoundException,
    );
    expect(repo.delete).toHaveBeenCalledWith({
      id: 'other-users-todo',
      userId: USER,
    });
  });

  it('does not expose the owner id in responses', async () => {
    repo.findOneBy.mockResolvedValue({ id: '1', userId: USER, repeatDays: [] });
    const todo = await service.findOne(USER, '1');
    expect(todo).not.toHaveProperty('userId');
  });
});
