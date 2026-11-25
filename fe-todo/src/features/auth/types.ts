export type AuthUser = { id: string; email: string };

/**
 * State returned by the auth Server Actions (used with useActionState).
 * React clears uncontrolled fields after each submit, so `email` (and `code`, when the
 * code was fine and only the password was wrong) is echoed back to keep what the user typed.
 */
export type AuthFormState =
  | { error?: string; notice?: string; email?: string; code?: string; /** Seconds before the next email may be requested. */ retryAfter?: number }
  | undefined;

export type LoginState = AuthFormState;
export type RegisterState = AuthFormState;
