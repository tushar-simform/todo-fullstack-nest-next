import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { passwordResetEmail, verificationEmail } from '../auth/auth-emails.js';
import { MAIL_LOGO_CID } from '../constants/index.js';
import { MAIL_LOGO_PATH } from './email-layout.js';

/**
 * Writes each email as a standalone HTML file under var/mail-preview/, so you
 * can open it in a browser while designing. The inline `cid:` logo is swapped
 * for a data URI (browsers can't resolve `cid:`). Run with `npm run mail:preview`.
 */
const SAMPLE_CODE = '482915';
const OUT_DIR = join(process.cwd(), 'var/mail-preview');

const logo = `data:image/png;base64,${readFileSync(MAIL_LOGO_PATH).toString('base64')}`;
mkdirSync(OUT_DIR, { recursive: true });

const previews = {
  'verification.html': verificationEmail(SAMPLE_CODE),
  'password-reset.html': passwordResetEmail(SAMPLE_CODE),
};
for (const [file, email] of Object.entries(previews)) {
  const page = email.html.value.replaceAll(`cid:${MAIL_LOGO_CID}`, logo);
  writeFileSync(join(OUT_DIR, file), page);
  console.log(`${email.subject}\n  -> ${join(OUT_DIR, file)}`);
}
