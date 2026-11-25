export const MAIL_TRANSPORT = {
  /** Prints mails in the server log; sends nothing. For development. */
  log: 'log',
  smtp: 'smtp',
} as const;

export const DEFAULT_MAIL_FROM = 'TushDo <no-reply@localhost>';

export const MAIL_APP_NAME = 'TushDo';

/** Content-ID the layout's <img> uses to point at the attached logo. */
export const MAIL_LOGO_CID = 'logo@tushdo';

/** Brand colours, matching the app theme and logo. Emails can't use CSS variables, so they are literals. */
export const MAIL_BRAND = {
  navy: '#0f1b2d',
  teal: '#19b5a8',
  tealSoft: '#e8f5f4',
  tealBorder: '#b9e0dd',
  page: '#f1f7f8',
  text: '#33475b',
  muted: '#5a6b7f',
  line: '#dbe7ea',
  card: '#ffffff',
} as const;

export const MAIL_FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
export const MAIL_MONO_STACK = "'SFMono-Regular',Menlo,Consolas,monospace";
