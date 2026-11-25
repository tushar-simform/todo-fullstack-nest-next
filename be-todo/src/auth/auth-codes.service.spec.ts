import type { Repository } from 'typeorm';
import { AUTH_CODE_PURPOSE } from '../constants/index.js';
import type { AuthCode } from './auth-code.entity.js';
import { AuthCodesService } from './auth-codes.service.js';

const purpose = AUTH_CODE_PURPOSE.emailVerification;

describe('AuthCodesService', () => {
  let repo: Record<string, ReturnType<typeof vi.fn>>;
  let service: AuthCodesService;
  let stored: AuthCode | null;

  /** Issues a code against an empty table and returns it plus the saved row. */
  async function issueFresh() {
    stored = null;
    const code = await service.issue('u1', purpose);
    const row = repo.upsert.mock.calls[0][0] as AuthCode;
    stored = Object.assign({}, row, { id: 'c1' }) as AuthCode;
    return { code: code as string, row };
  }

  beforeEach(() => {
    stored = null;
    repo = {
      findOneBy: vi.fn(async () => stored),
      upsert: vi.fn(),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
      increment: vi.fn(),
    };
    service = new AuthCodesService(repo as unknown as Repository<AuthCode>);
  });

  it('issues a 6-digit code and stores only its hash', async () => {
    const { code, row } = await issueFresh();
    expect(code).toMatch(/^\d{6}$/);
    expect(row.codeHash).toMatch(/^[0-9a-f]{64}$/);
    expect(row.codeHash).not.toContain(code);
    expect(row.failedAttempts).toBe(0);
    expect(row.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('does not issue a new code during the resend cooldown', async () => {
    stored = { createdAt: new Date() } as AuthCode;
    await expect(service.issue('u1', purpose)).resolves.toBeNull();
    expect(repo.upsert).not.toHaveBeenCalled();
  });

  it('accepts the right code once', async () => {
    const { code } = await issueFresh();
    await expect(service.consume('u1', purpose, code)).resolves.toBe(true);
    expect(repo.delete).toHaveBeenCalledWith({ id: 'c1' });
  });

  it('rejects a second use when another request already consumed it', async () => {
    const { code } = await issueFresh();
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.consume('u1', purpose, code)).resolves.toBe(false);
  });

  it('counts a wrong code as a failed attempt', async () => {
    await issueFresh();
    await expect(service.consume('u1', purpose, '000000')).resolves.toBe(false);
    expect(repo.increment).toHaveBeenCalledWith(
      { id: 'c1' },
      'failedAttempts',
      1,
    );
  });

  it('rejects and removes an expired code, even when it is right', async () => {
    const { code } = await issueFresh();
    stored!.expiresAt = new Date(Date.now() - 1000);
    await expect(service.consume('u1', purpose, code)).resolves.toBe(false);
    expect(repo.delete).toHaveBeenCalledWith({ id: 'c1' });
  });

  it('rejects when there is no code', async () => {
    stored = null;
    await expect(service.consume('u1', purpose, '123456')).resolves.toBe(false);
  });
});
