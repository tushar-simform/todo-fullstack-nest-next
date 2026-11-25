import { html, type MailAttachmentInput, type SafeHtml } from '@nestjs/mail';
import {
  AUTH_CODE_TTL_MINUTES,
  MAIL_APP_NAME,
  MAIL_BRAND,
  MAIL_FONT_STACK,
  MAIL_MONO_STACK,
} from '../constants/index.js';
import { MAIL_LOGO_ATTACHMENT, emailLayout } from '../mail/email-layout.js';

export type AuthEmail = {
  subject: string;
  html: SafeHtml;
  attachments: MailAttachmentInput[];
};

type CodeEmailOptions = {
  subject: string;
  preheader: string;
  heading: string;
  intro: string;
  code: string;
  /** Said under the code, e.g. what to do if this wasn't you. */
  ignoreNote: string;
};

/** A "here is your one-time code" email. Every value is HTML-escaped by `html`. */
function codeEmail(o: CodeEmailOptions): AuthEmail {
  const c = MAIL_BRAND;
  const body = html`
    <h1
      style="margin:0 0 12px;font-family:${MAIL_FONT_STACK};font-size:24px;line-height:1.3;color:${c.navy};"
    >
      ${o.heading}
    </h1>
    <p style="margin:0 0 24px;">${o.intro}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td
          align="center"
          style="background:${c.tealSoft};border:1px solid ${c.tealBorder};border-radius:12px;padding:22px 12px;"
        >
          <span
            style="font-family:${MAIL_MONO_STACK};font-size:36px;font-weight:700;letter-spacing:12px;color:${c.navy};padding-left:12px;"
            >${o.code}</span
          >
        </td>
      </tr>
    </table>
    <p
      style="margin:16px 0 0;text-align:center;font-size:14px;color:${c.muted};"
    >
      This code expires in ${AUTH_CODE_TTL_MINUTES} minutes.
    </p>
    <hr style="border:0;border-top:1px solid ${c.line};margin:28px 0 20px;" />
    <p style="margin:0;font-size:14px;color:${c.muted};">${o.ignoreNote}</p>
  `;
  return {
    subject: o.subject,
    html: emailLayout({ preheader: o.preheader, children: body }),
    attachments: [MAIL_LOGO_ATTACHMENT],
  };
}

export function verificationEmail(code: string): AuthEmail {
  return codeEmail({
    subject: `${code} is your ${MAIL_APP_NAME} verification code`,
    preheader: `Your verification code is ${code}. It expires in ${AUTH_CODE_TTL_MINUTES} minutes.`,
    heading: 'Verify your email',
    intro: `Welcome to ${MAIL_APP_NAME}! Enter this code on the verification page to finish creating your account.`,
    code,
    ignoreNote: `If you didn't create a ${MAIL_APP_NAME} account, you can safely ignore this email.`,
  });
}

export function passwordResetEmail(code: string): AuthEmail {
  return codeEmail({
    subject: `${code} is your ${MAIL_APP_NAME} password reset code`,
    preheader: `Your password reset code is ${code}. It expires in ${AUTH_CODE_TTL_MINUTES} minutes.`,
    heading: 'Reset your password',
    intro: 'Enter this code on the reset page to choose a new password.',
    code,
    ignoreNote:
      "If you didn't ask to reset your password, you can ignore this email. Your password has not changed.",
  });
}
