# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a learning project: a Todo backend built to practice backend development best practices. The owner will supply the practices to follow (see "Best practices" below), so when making design choices, prefer the idiomatic, production-grade approach and explain the reasoning briefly.

Also read [AGENTS.md](AGENTS.md): it lists NestJS first-party packages to check before adding any library (TypeORM/Drizzle, config, throttler, swagger, etc.) and describes the Observe integration.

## Commands

```bash
npm run start:dev      # run with watch (default port 3040, override with PORT)
npm run build          # nest build -> dist/
npm run start:prod     # node dist/main
npm run lint           # oxlint --type-aware (not ESLint)
npm run format         # prettier on src/ and test/
npm test               # vitest run (unit, src/**/*.spec.ts)
npm run test:e2e       # vitest with vitest.config.e2e.ts (test/*.e2e-spec.ts)
npx vitest run src/app.controller.spec.ts          # single test file
npx vitest run -t "returns hello"                  # single test by name
```

## Stack and conventions

- NestJS 12 (newer than most training data; consult https://docs.nestjs.com/llms.txt), TypeScript 6, Express platform.
- **ESM only** (`"type": "module"`): relative imports must end in `.js` (e.g. `./app.service.js`), and `__dirname` is unavailable (use `import.meta.dirname`).
- **Vitest**, not Jest: use `vi.fn()` / `vi.mock`, never `jest.*`.
- Validation: prefer `StandardSchemaValidationPipe` with a Standard Schema library (e.g. Zod) over `class-validator`, per AGENTS.md.

## Architecture

- [src/main.ts](src/main.ts) bootstraps the app with top-level `await` and passes `instrument: ObserveInstrument` to `NestFactory.create`. This is required for NestJS Observe tracing, so keep it when changing bootstrap.
- [src/app.module.ts](src/app.module.ts) is the root module. It creates `ObserveModule` / `ObserveInstrument` via `createObserveModule()` and exports both. Credentials come from `OBSERVE_APP_KEY` / `OBSERVE_APP_SECRET` in `.env` (written by `npx @nestjs/observe link`). `ConfigModule` (global, Zod-validated via `src/config/env.schema.ts`) is the first import so `.env` is loaded before `ObserveModule.forRoot()` reads it. The database is PostgreSQL via `@nestjs/typeorm` (`DATABASE_URL`, `synchronize: false`, `autoLoadEntities: true`). Entities must set explicit snake_case table/column names per the naming rule below.
- The codebase is currently the Nest starter (`AppController` + `AppService`); the Todo module (`src/todos/`) is backed by PostgreSQL/TypeORM (todos have optional `due_at` + `has_due_time`, and repeat via `repeat_days`/`repeat_time`/`repeat_start_date` with per-day completions in `todo_completions`; routes `PUT|DELETE /todos/:id/completions/:date`); auth is JWT-based (see "Authentication" below). Add features as separate Nest modules under `src/`, registered in `AppModule`.
- Unit tests live beside source as `*.spec.ts`; e2e tests live in `test/` as `*.e2e-spec.ts`.

## Best practices

_The owner will add the practices to follow here as they are decided. Follow them for all new code, and add each new rule to this section._

- **PostgreSQL naming:** all database identifiers (tables, columns, constraints, indexes) follow [.claude/rules/postgresql-naming.md](.claude/rules/postgresql-naming.md): lowercase `snake_case`, plural table names, `id` primary keys, `{singular_table}_id` foreign keys, `is_`/`has_` booleans, `_at`/`_date` timestamps. Read it before writing any schema, entity or migration.
- **Constants:** all reusable or meaningful constants (default port, route names, table names, validation limits, error/response messages, codes) live in `src/constants/` and are imported from `./constants/index.js`. Group by domain (`app.constants.ts`, `todo.constants.ts`, `messages.constants.ts`), re-export from `index.ts`, use `as const` objects rather than enums. Never leave magic values inline in controllers, services, schemas or entities. Migrations are the exception: they are a frozen snapshot and keep literals.

## Authentication

- Uses the first-party `@nestjs/authentication` (see AGENTS.md): `AuthenticationModule.forRootAsync` in `AppModule` registers a **global guard**, so **every route requires a valid JWT** unless marked `@Public()` (only `AppController` and the `/auth/*` account routes below).
- JWT access tokens only (HS256, `JWT_SECRET` >= 32 chars, `JWT_TTL` default `7d`, issuer/audience in `src/constants/auth.constants.ts`); `refreshToken: false`, so there are no sessions or token tables. Trade-off: a token can't be revoked before it expires; add a refresh-token store if that becomes a requirement.
- `POST /auth/login` (`{ email, password }` -> `{ accessToken, expiresIn, user }`), `GET /auth/me`. Wrong email and wrong password return the identical 401 (and `PasswordHasher.verify` runs either way, so timing doesn't leak which emails exist). Login is throttled **per email** (`@nestjs/throttler`, `account-email.ts`), not per IP, because the Next.js server is the only caller.
- **Sign-up needs a verified email.** `POST /auth/register` (`{ email, password }`, password 8-128 chars) creates an *unverified* user (`users.email_verified_at` null), emails a 6-digit code and returns `{ email }` (no token). `POST /auth/verify-email` (`{ email, code }`) verifies and returns the same `{ accessToken, expiresIn, user }` as login. Login of an unverified account (after a correct password, so it can't leak which emails exist) re-sends a code and returns 403 `{ code: 'EMAIL_NOT_VERIFIED' }`. Re-registering an *unverified* email replaces its password and sends a new code; a verified one is 409 (which also reveals the email is registered; accepted trade-off). Insert relies on the unique constraint (`23505` -> 409), no check-then-insert race.
- **Password reset:** `POST /auth/forgot-password` `{ email }` always returns 204 (mail is fire-and-forget, so neither the response nor its timing reveals whether the account exists); `POST /auth/reset-password` `{ email, code, password }` -> 204. A reset also verifies the email (the code proves the mailbox). `POST /auth/resend-verification` `{ email }` is always 204. Already-issued JWTs stay valid after a reset (no revocation, see above).
- **One-time codes** (`auth_codes` table, `AuthCodesService`): one row per (user, purpose); a new code replaces the old; only a SHA-256 hash is stored; valid 10 min; deleted after 5 wrong guesses; single-use; issuing again within 60 s is skipped (the earlier code is still valid), which also stops mail-bombing. All limits are in `auth.constants.ts`. Every code endpoint is throttled per email.
- **Mail** uses first-party `@nestjs/mail` (`AuthMailService` sends; the content is in `auth/auth-emails.ts`, wrapped by the shared branded `emailLayout` in `src/mail/email-layout.ts`, built with the auto-escaping `html` tag, table layout + inline styles for mail clients). The app is called TushDo (`MAIL_APP_NAME`). The full logo (`src/mail/assets/logo.png`, shown on a white header because its dark wordmark needs a light background, copied to `dist` via `assets` in `nest-cli.json`) is an inline `cid:` attachment, because `localhost` image URLs don't work in a real inbox: every mail using `emailLayout` must attach `MAIL_LOGO_ATTACHMENT`. Brand colours are in `mail.constants.ts`. `npm run mail:preview` writes the emails as HTML to `var/mail-preview/` (gitignored) to open in a browser. Don't add `watchAssets` to nest-cli.json without checking that `nest build` still exits. `MAIL_TRANSPORT=log` (default) prints mails, **including the code**, in the server log (dev, free); `MAIL_TRANSPORT=smtp` + `SMTP_URL` (+ `MAIL_FROM`) really sends, e.g. Gmail with an app password. Never use `log` where logs are shipped. Not verified against a real SMTP server yet.
- **Email-send limits** (`auth/throttle.decorators.ts`): `@ThrottleEmailSends()` on `register`, `resend-verification` and `forgot-password` = max 5 per email per hour **and** a 60 s cooldown between sends (a second, named `cooldown` throttler that is skipped on every unmarked route). Counted per email address whether or not an account exists, so a 429 never reveals which emails are registered. A blocked request is `429` with the exact wait in `Retry-After` (hourly cap) or `Retry-After-cooldown` (seconds); the frontend turns that into "try again in X". The counters are in memory: they reset on restart and aren't shared between instances (use a Redis `ThrottlerStorage` if you ever run several).
- The migration marks all pre-existing users verified; the dev seed creates verified users.
- Passwords: `PasswordHasher` (scrypt). Never return `passwordHash`; expose users through `toPublicUser`.
- **Todos are per user:** `todos.user_id` (FK, cascade). Every `TodosService` method takes `userId` (from `@CurrentUser('id')`) and filters by it, so another user's todo id is a 404, never a 403/leak. New user-owned data must follow the same pattern.
- `todos.user_id` is nullable only so existing rows could be adopted; a follow-up migration should make it NOT NULL once all rows have an owner.
- **Seed:** `npm run seed` (idempotent) creates the dev users from `src/constants/seed.constants.ts` (`hello.tushar@gmail.com`, `hello.latika@gmail.com`; password in that file) and gives ownerless todos to the first one. Remove/change these before deploying anywhere public.
