import { html, type MailAttachmentInput, type SafeHtml } from '@nestjs/mail';
import { join } from 'node:path';
import {
  MAIL_APP_NAME,
  MAIL_BRAND,
  MAIL_FONT_STACK,
  MAIL_LOGO_CID,
} from '../constants/index.js';

/** Copied next to the compiled code by the `assets` entry in nest-cli.json. */
export const MAIL_LOGO_PATH = join(import.meta.dirname, 'assets/logo.png');

/**
 * The logo as an inline attachment: mail clients can't reach `localhost`, so the
 * image travels inside the message and the layout points at it by `cid:`.
 * Attach this to every mail that uses `emailLayout`, or the header image breaks.
 */
export const MAIL_LOGO_ATTACHMENT: MailAttachmentInput = {
  cid: MAIL_LOGO_CID,
  path: MAIL_LOGO_PATH,
  filename: 'logo.png',
};

/** The logo is shown at this width (the file is ~2x for sharp retina screens). */
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 67;

type EmailLayoutOptions = {
  /** Grey preview text shown next to the subject in the inbox list. */
  preheader: string;
  children: SafeHtml;
};

/**
 * Shared look of every email: white header with the full logo (its dark
 * wordmark needs a light background), teal accent line, white card, quiet
 * footer. Table-based with inline styles, because mail clients ignore most CSS.
 */
export function emailLayout({
  preheader,
  children,
}: EmailLayoutOptions): SafeHtml {
  const c = MAIL_BRAND;
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <title>${MAIL_APP_NAME}</title>
      </head>
      <body style="margin:0;padding:0;background:${c.page};">
        <div
          style="display:none;max-height:0;overflow:hidden;opacity:0;color:${c.page};"
        >
          ${preheader}
        </div>
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="background:${c.page};"
        >
          <tr>
            <td align="center" style="padding:28px 12px;">
              <table
                role="presentation"
                width="560"
                cellpadding="0"
                cellspacing="0"
                style="width:100%;max-width:560px;"
              >
                <tr>
                  <td
                    style="background:${c.card};border-radius:16px 16px 0 0;padding:26px 32px 22px;border-bottom:3px solid ${c.teal};"
                  >
                    <img
                      src="cid:${MAIL_LOGO_CID}"
                      width="${LOGO_WIDTH}"
                      height="${LOGO_HEIGHT}"
                      alt="${MAIL_APP_NAME}"
                      style="display:block;border:0;outline:none;height:auto;max-width:100%;"
                    />
                  </td>
                </tr>
                <tr>
                  <td
                    style="background:${c.card};border-radius:0 0 16px 16px;padding:32px 32px 32px;font-family:${MAIL_FONT_STACK};font-size:16px;line-height:1.6;color:${c.text};"
                  >
                    ${children}
                  </td>
                </tr>
                <tr>
                  <td
                    style="padding:20px 32px;text-align:center;font-family:${MAIL_FONT_STACK};font-size:12px;line-height:1.5;color:${c.muted};"
                  >
                    Sent by ${MAIL_APP_NAME}. Please don't reply to this email,
                    nobody reads this inbox.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
}
