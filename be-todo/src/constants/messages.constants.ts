export const TODO_MESSAGES = {
  notFound: (id: string) => `Todo ${id} not found`,
  updateRequiresField: 'At least one field must be provided',
} as const;

export const AUTH_MESSAGES = {
  invalidCredentials: 'Invalid email or password',
} as const;
