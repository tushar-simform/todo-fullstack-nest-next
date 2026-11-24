import { API_PORT_HINT } from "./app.constants";
import { TODO_DESCRIPTION_MAX_LENGTH, TODO_TITLE_MAX_LENGTH } from "./todo.constants";

export const MESSAGES = {
  genericError: "Something went wrong. Is the API running?",
  titleRequired: "Title is required.",
  titleTooLong: `Title must be ≤ ${TODO_TITLE_MAX_LENGTH} characters.`,
  descriptionTooLong: `Description must be ≤ ${TODO_DESCRIPTION_MAX_LENGTH} characters.`,
  loginFieldsInvalid: "Enter a valid email and your password.",
  invalidCredentials: "Invalid email or password.",
  tooManyAttempts: "Too many attempts. Please try again in a few minutes.",
  invalidRepeat: "Choose at least one weekday for a repeating todo.",
  invalidDueDate: "Please choose a valid due date.",
  loadTodosFailedTitle: "Couldn't load your todos",
  loadTodosFailedHint: `Make sure the be-todo API is running on port ${API_PORT_HINT}, then try again.`,
} as const;
