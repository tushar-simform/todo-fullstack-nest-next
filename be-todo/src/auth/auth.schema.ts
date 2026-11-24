import { z } from 'zod';

/** Sign-in doesn't enforce password rules, so older passwords keep working. */
export const loginSchema = z.object({
  email: z.email().max(320),
  password: z.string().min(1).max(128),
});

export type LoginDto = z.infer<typeof loginSchema>;
