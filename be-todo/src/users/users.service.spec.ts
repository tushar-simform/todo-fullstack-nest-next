import { UsersService } from './users.service.js';

describe('UsersService.normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(UsersService.normalizeEmail('  Hello.Tushar@Gmail.COM ')).toBe(
      'hello.tushar@gmail.com',
    );
  });

  it('normalizes unicode to NFC', () => {
    expect(UsersService.normalizeEmail('é@x.co')).toBe('é@x.co');
  });
});
