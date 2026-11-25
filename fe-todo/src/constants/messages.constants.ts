import { API_PORT_HINT } from "./app.constants";
import { AUTH_CODE_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./auth.constants";
import { TODO_DESCRIPTION_MAX_LENGTH, TODO_TITLE_MAX_LENGTH } from "./todo.constants";

export const MESSAGES = {
  genericError: "Something went wrong. Is the API running?",
  titleRequired: "Title is required.",
  titleTooLong: `Title must be ≤ ${TODO_TITLE_MAX_LENGTH} characters.`,
  descriptionTooLong: `Description must be ≤ ${TODO_DESCRIPTION_MAX_LENGTH} characters.`,
  loginFieldsInvalid: "Enter a valid email and your password.",
  invalidCredentials: "Invalid email or password.",
  registerEmailInvalid: "Enter a valid email address.",
  passwordTooShort: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  passwordTooLong: `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`,
  passwordsDoNotMatch: "Passwords don't match.",
  codeInvalidFormat: `Enter the ${AUTH_CODE_LENGTH}-digit code from the email.`,
  invalidCode: "That code is wrong or has expired. Request a new one.",
  codeResent: "A new code is on its way. Check your inbox and spam folder.",
  emailTaken: "An account with this email already exists. Try logging in.",
  tooManyAttempts: "Too many attempts. Please try again in a few minutes.",
  /** `wait` comes from formatWait(), e.g. "45 seconds" or "12 minutes". */
  rateLimited: (wait: string) => `You've reached the limit. Please try again in ${wait}.`,
  invalidRepeat: "Choose at least one weekday for a repeating todo.",
  invalidDueDate: "Please choose a valid due date.",
  loadTodosFailedTitle: "Couldn't load your todos",
  loadTodosFailedHint: `Make sure the be-todo API is running on port ${API_PORT_HINT}, then try again.`,
} as const;
