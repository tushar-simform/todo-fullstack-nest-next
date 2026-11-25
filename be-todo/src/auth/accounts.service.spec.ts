import { BadRequestException, ConflictException } from '@nestjs/common';
import type { PasswordHasher } from '@nestjs/authentication';
import { QueryFailedError } from 'typeorm';
import { AUTH_CODE_PURPOSE } from '../constants/index.js';
import type { User } from '../users/user.entity.js';
import type { UsersService } from '../users/users.service.js';
import { AccountsService } from './accounts.service.js';
import type { AuthCodesService } from './auth-codes.service.js';
import type { AuthMailService } from './auth-mail.service.js';

const duplicateEmailError = () =>
  Object.assign(new QueryFailedError('INSERT', [], new Error('duplicate')), {
    driverError: { code: '23505' },
  });

describe('AccountsService', () => {
  let user: User;
  let users: Record<string, ReturnType<typeof vi.fn>>;
  let codes: Record<string, ReturnType<typeof vi.fn>>;
  let mail: Record<string, ReturnType<typeof vi.fn>>;
  let hasher: Record<string, ReturnType<typeof vi.fn>>;
  let service: AccountsService;

  beforeEach(() => {
    user = { id: 'u1', email: 'a@b.co', emailVerifiedAt: null } as User;
    users = {
      create: vi.fn().mockResolvedValue(user),
      findByEmail: vi.fn().mockResolvedValue(user),
      markEmailVerified: vi.fn(async (u: User) => u),
      setPasswordHash: vi.fn(async (u: User) => u),
    };
    codes = {
      issue: vi.fn().mockResolvedValue('123456'),
      consume: vi.fn().mockResolvedValue(true),
    };
    mail = { sendVerificationCode: vi.fn(), sendPasswordResetCode: vi.fn() };
    hasher = { hash: vi.fn().mockResolvedValue('HASH') };
    service = new AccountsService(
      users as unknown as UsersService,
      codes as unknown as AuthCodesService,
      mail as unknown as AuthMailService,
      hasher as unknown as PasswordHasher,
    );
  });

  describe('register', () => {
    it('creates an unverified user and emails a verification code', async () => {
      await expect(service.register('a@b.co', 'password1')).resolves.toBe(user);
      expect(users.create).toHaveBeenCalledWith('a@b.co', 'HASH');
      expect(codes.issue).toHaveBeenCalledWith(
        'u1',
        AUTH_CODE_PURPOSE.emailVerification,
      );
      expect(mail.sendVerificationCode).toHaveBeenCalledWith(
        'a@b.co',
        '123456',
      );
    });

    it('does not send a mail while the previous code is still fresh', async () => {
      codes.issue.mockResolvedValue(null);
      await service.register('a@b.co', 'password1');
      expect(mail.sendVerificationCode).not.toHaveBeenCalled();
    });

    it('throws 409 when the email belongs to a verified account', async () => {
      users.create.mockRejectedValue(duplicateEmailError());
      users.findByEmail.mockResolvedValue(
        Object.assign({}, user, { emailVerifiedAt: new Date() }),
      );
      await expect(service.register('a@b.co', 'password1')).rejects.toThrow(
        ConflictException,
      );
      expect(mail.sendVerificationCode).not.toHaveBeenCalled();
    });

    it('restarts sign-up for an unverified account: new password, new code', async () => {
      users.create.mockRejectedValue(duplicateEmailError());
      await service.register('a@b.co', 'password2');
      expect(users.setPasswordHash).toHaveBeenCalledWith(user, 'HASH');
      expect(mail.sendVerificationCode).toHaveBeenCalledWith(
        'a@b.co',
        '123456',
      );
    });

    it('rethrows other database errors', async () => {
      const boom = new Error('connection lost');
      users.create.mockRejectedValue(boom);
      await expect(service.register('a@b.co', 'password1')).rejects.toBe(boom);
    });
  });

  describe('verifyEmail', () => {
    it('marks the user verified when the code is right', async () => {
      await service.verifyEmail('a@b.co', '123456');
      expect(codes.consume).toHaveBeenCalledWith(
        'u1',
        AUTH_CODE_PURPOSE.emailVerification,
        '123456',
      );
      expect(users.markEmailVerified).toHaveBeenCalledWith(user);
    });

    it('rejects a wrong code', async () => {
      codes.consume.mockResolvedValue(false);
      await expect(service.verifyEmail('a@b.co', '000000')).rejects.toThrow(
        BadRequestException,
      );
      expect(users.markEmailVerified).not.toHaveBeenCalled();
    });

    it('rejects an unknown email the same way', async () => {
      users.findByEmail.mockResolvedValue(null);
      await expect(service.verifyEmail('x@y.co', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resendVerification', () => {
    it('sends a code to an unverified account', async () => {
      await service.resendVerification('a@b.co');
      expect(mail.sendVerificationCode).toHaveBeenCalled();
    });

    it('stays silent for verified and unknown accounts', async () => {
      users.findByEmail.mockResolvedValue(
        Object.assign({}, user, { emailVerifiedAt: new Date() }),
      );
      await service.resendVerification('a@b.co');
      users.findByEmail.mockResolvedValue(null);
      await service.resendVerification('x@y.co');
      expect(mail.sendVerificationCode).not.toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('sends a reset code to an existing account', async () => {
      await service.forgotPassword('a@b.co');
      expect(codes.issue).toHaveBeenCalledWith(
        'u1',
        AUTH_CODE_PURPOSE.passwordReset,
      );
      expect(mail.sendPasswordResetCode).toHaveBeenCalledWith(
        'a@b.co',
        '123456',
      );
    });

    it('stays silent for an unknown email', async () => {
      users.findByEmail.mockResolvedValue(null);
      await expect(service.forgotPassword('x@y.co')).resolves.toBeUndefined();
      expect(mail.sendPasswordResetCode).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('sets the new password (and verifies the email) with a valid code', async () => {
      await service.resetPassword('a@b.co', '123456', 'newpassword1');
      expect(users.setPasswordHash).toHaveBeenCalledWith(user, 'HASH', {
        verifyEmail: true,
      });
    });

    it('rejects a wrong code without touching the password', async () => {
      codes.consume.mockResolvedValue(false);
      await expect(
        service.resetPassword('a@b.co', '000000', 'newpassword1'),
      ).rejects.toThrow(BadRequestException);
      expect(users.setPasswordHash).not.toHaveBeenCalled();
    });
  });
});
