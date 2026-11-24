import type { PasswordHasher } from '@nestjs/authentication';
import type { User } from '../users/user.entity.js';
import type { UsersService } from '../users/users.service.js';
import { CredentialsService } from './credentials.service.js';

describe('CredentialsService', () => {
  const user = { id: 'u1', email: 'a@b.co', passwordHash: 'HASH' } as User;
  let users: { findByEmail: ReturnType<typeof vi.fn> };
  let hasher: { verify: ReturnType<typeof vi.fn> };
  let service: CredentialsService;

  beforeEach(() => {
    users = { findByEmail: vi.fn() };
    hasher = { verify: vi.fn() };
    service = new CredentialsService(
      users as unknown as UsersService,
      hasher as unknown as PasswordHasher,
    );
  });

  it('returns the user when the password matches', async () => {
    users.findByEmail.mockResolvedValue(user);
    hasher.verify.mockResolvedValue(true);
    await expect(service.verify('a@b.co', 'pw')).resolves.toBe(user);
    expect(hasher.verify).toHaveBeenCalledWith('pw', 'HASH');
  });

  it('returns null for a wrong password', async () => {
    users.findByEmail.mockResolvedValue(user);
    hasher.verify.mockResolvedValue(false);
    await expect(service.verify('a@b.co', 'bad')).resolves.toBeNull();
  });

  it('still hashes (constant time) and returns null for an unknown email', async () => {
    users.findByEmail.mockResolvedValue(null);
    hasher.verify.mockResolvedValue(false);
    await expect(service.verify('nobody@b.co', 'pw')).resolves.toBeNull();
    expect(hasher.verify).toHaveBeenCalledWith('pw', undefined);
  });
});
