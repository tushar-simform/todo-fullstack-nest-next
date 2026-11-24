import { z } from 'zod';
import {
  TIME_OF_DAY_PATTERN,
  TODO_DESCRIPTION_MAX_LENGTH,
  TODO_MESSAGES,
  TODO_TITLE_MAX_LENGTH,
  WEEKDAY_MAX,
  WEEKDAY_MIN,
  WEEKDAYS_PER_WEEK,
} from '../constants/index.js';

/** ISO-8601 instant (with offset or Z) -> Date. */
const dueAtSchema = z.iso
  .datetime({ offset: true })
  .transform((v) => new Date(v));

/** Unique, sorted weekday numbers (0 = Sun ... 6 = Sat). */
const repeatDaysSchema = z
  .array(z.number().int().min(WEEKDAY_MIN).max(WEEKDAY_MAX))
  .max(WEEKDAYS_PER_WEEK)
  .transform((days) => [...new Set(days)].sort((a, b) => a - b));

const repeatTimeSchema = z.string().regex(TIME_OF_DAY_PATTERN);

export const occurrenceDateSchema = z.iso.date();

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(TODO_TITLE_MAX_LENGTH),
  description: z.string().trim().max(TODO_DESCRIPTION_MAX_LENGTH).optional(),
  dueAt: dueAtSchema.optional(),
  hasDueTime: z.boolean().optional(),
  repeatDays: repeatDaysSchema.optional(),
  repeatTime: repeatTimeSchema.nullable().optional(),
  repeatStartDate: z.iso.date().nullable().optional(),
});

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(TODO_TITLE_MAX_LENGTH),
    description: z.string().trim().max(TODO_DESCRIPTION_MAX_LENGTH).nullable(),
    isCompleted: z.boolean(),
    dueAt: dueAtSchema.nullable(),
    hasDueTime: z.boolean(),
    repeatDays: repeatDaysSchema,
    repeatTime: repeatTimeSchema.nullable(),
    repeatStartDate: z.iso.date().nullable(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, {
    message: TODO_MESSAGES.updateRequiresField,
  });

export const todoIdSchema = z.uuid();

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
