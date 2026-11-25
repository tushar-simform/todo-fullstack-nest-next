import { MAIL_LOGO_CID } from '../constants/index.js';
import { passwordResetEmail, verificationEmail } from './auth-emails.js';

describe('auth emails', () => {
  it('puts the code in the subject, the preheader and the body', () => {
    const email = verificationEmail('123456');
    expect(email.subject).toBe('123456 is your TushDo verification code');
    // preheader (inbox preview text) + the big code box
    expect(email.html.value.match(/123456/g)).toHaveLength(2);
  });

  it('references the logo by cid and attaches it inline', () => {
    const email = passwordResetEmail('654321');
    expect(email.html.value).toContain(`src="cid:${MAIL_LOGO_CID}"`);
    expect(email.attachments).toEqual([
      expect.objectContaining({ cid: MAIL_LOGO_CID }),
    ]);
  });

  it('uses different wording for each purpose', () => {
    expect(verificationEmail('111111').html.value).toContain(
      'Verify your email',
    );
    expect(passwordResetEmail('111111').html.value).toContain(
      'Reset your password',
    );
  });

  it('escapes anything that is not a code', () => {
    expect(verificationEmail('<b>x</b>').html.value).not.toContain('<b>x</b>');
  });
});
