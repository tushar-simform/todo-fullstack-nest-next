export const TODOS_ROUTE = 'todos';
export const TODOS_TABLE = 'todos';

export const TODO_TITLE_MAX_LENGTH = 200;
export const TODO_DESCRIPTION_MAX_LENGTH = 2000;

export const TODO_COMPLETIONS_TABLE = 'todo_completions';
export const TODO_COMPLETIONS_ROUTE = ':id/completions/:date';

/** Weekdays use JS numbering: 0 = Sunday ... 6 = Saturday. */
export const WEEKDAY_MIN = 0;
export const WEEKDAY_MAX = 6;
export const WEEKDAYS_PER_WEEK = 7;

/** Local wall-clock time, 24h `HH:mm`. */
export const TIME_OF_DAY_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
