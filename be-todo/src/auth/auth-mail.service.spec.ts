import { InMemoryMailTransport, MailModule } from '@nestjs/mail';
import { Test } from '@nestjs/testing';
import { MAIL_LOGO_CID } from '../constants/index.js';
import { AuthMailService } from './auth-mail.service.js';

describe('AuthMailService (real Mailer, in-memory transport)', () => {
  let mailbox: InMemoryMailTransport;
  let service: AuthMailService;

  beforeEach(async () => {
    mailbox = new InMemoryMailTransport();
    const moduleRef = await Test.createTestingModule({
      imports: [
        MailModule.forRoot({
          transport: mailbox,
          from: 'Todo <no-reply@todo.test>',
        }),
      ],
      providers: [AuthMailService],
    }).compile();
    service = moduleRef.get(AuthMailService);
  });

  it('delivers the verification email with the logo embedded', async () => {
    service.sendVerificationCode('new@user.test', '482915');
    await vi.waitFor(() => expect(mailbox.mails).toHaveLength(1));

    const [mail] = mailbox.mails;
    expect(mail.subject).toBe('482915 is your TushDo verification code');
    expect(mail.to.map((a) => a.address)).toEqual(['new@user.test']);
    expect(mail.html).toContain('482915');
    expect(mail.html).toContain(`cid:${MAIL_LOGO_CID}`);
    // the PNG really is inside the message, not just referenced
    expect(mail.raw).toContain(`Content-ID: <${MAIL_LOGO_CID}>`);
    expect(mail.raw).toContain('Content-Type: image/png');
    // plain-text part (for clients that don't show HTML) still carries the code
    expect(mail.text).toContain('482915');
  });

  it('delivers the password reset email', async () => {
    service.sendPasswordResetCode('a@b.test', '000111');
    await vi.waitFor(() => expect(mailbox.mails).toHaveLength(1));
    expect(mailbox.mails[0].subject).toBe(
      '000111 is your TushDo password reset code',
    );
    expect(mailbox.mails[0].html).toContain('Reset your password');
  });
});
