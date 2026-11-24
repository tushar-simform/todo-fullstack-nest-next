import { UsersService } from '../users/users.service.js';

/** The email named in the request body, normalized, or `''` when absent. */
export function accountEmail(req: { body?: { email?: unknown } }): string {
  const email = req.body?.email;
  return typeof email === 'string' ? UsersService.normalizeEmail(email) : '';
}
