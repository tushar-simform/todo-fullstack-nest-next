export type AuthUser = { id: string; email: string };

/** State returned by the login Server Action (used with useActionState). */
export type LoginState = { error?: string; email?: string } | undefined;
