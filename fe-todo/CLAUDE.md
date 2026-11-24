# CLAUDE.md

Guidance for Claude Code in this repository (`fe-todo`, the frontend of the Todo learning project).

Also read [AGENTS.md](AGENTS.md): this is Next.js 16 and differs from training data. Read the relevant guide in `node_modules/next/dist/docs/` before using any Next.js API.

## Purpose

Frontend for the `../be-todo` NestJS API (default `http://localhost:3040`, configured by `API_URL` in `.env.local`). A learning project: prefer idiomatic Next.js 16 and explain reasoning briefly.

## Commands

```bash
npm run dev     # http://localhost:3000 (backend must run on 3040)
npm run build   # production build; also type-checks
npm run lint    # eslint
```

## Next.js 16 rules for this repo

- `cacheComponents: true` + `partialPrefetching: true` are on. Anything async and uncached (fetches, `cookies()`, `searchParams`) must sit inside `<Suspense>`, or the build fails with a blocking-route error.
- The todo list is **intentionally uncached** (`features/todos/api.ts`) and streamed inside `<Suspense>`. Do not add `"use cache"` to API reads: it bakes data into the build and requires the backend at build time.
- Mutations are Server Actions (`features/todos/actions.ts`) that call `refresh()` from `next/cache`. Server Actions return `ActionResult`, they do not throw to the UI.
- UI is optimistic via `useOptimistic` + `useTransition` (see `todo-board.tsx`).
- Server Components by default. Add `"use client"` only to leaf components that need state, effects or event handlers. Never put a value the server needs inside a `"use client"` file (it becomes a client reference): shared constants go in `src/constants/`.
- Use `LayoutProps<"/">` / `PageProps` global helper types, `next/link`, `next/font`. `params` / `searchParams` are Promises.
- Secrets/API URL stay server-side (no `NEXT_PUBLIC_` for `API_URL`). Server-only modules start with `import "server-only"`.

## Todos domain model

- **One-time todo:** `dueAt` (UTC ISO, nullable) + `hasDueTime` (false = date-only, due by end of that local day).
- **Repeating todo:** one row with `repeatDays` (0 = Sun ... 6 = Sat), optional `repeatTime` (`HH:mm`, local) and `repeatStartDate`. Each completed day is a row in the backend's `todo_completions`, returned as `completedDates` (`YYYY-MM-DD`). Completing Monday never completes Wednesday.
- **Occurrence** (`features/todos/types.ts`): one displayable instance (a one-time todo, or one day of a repeating one). `features/todos/occurrences.ts` (`selectOccurrences`) derives every tab from the todo list; keep that logic pure and in that file.
- **Tabs / routes** (`app/(todos)/`): `/today`, `/all`, `/due`, `/upcoming`, `/done` (`/` redirects to `/today`). The shared layout fetches once and `TodosProvider` holds optimistic state + the create/edit dialog for all tabs. Due = open occurrences whose time has passed (repeating: last `RECURRING_LOOKBACK_DAYS`); Upcoming looks `RECURRING_LOOKAHEAD_DAYS` ahead.
- Timezone: dates/times are interpreted in the browser's timezone (single-user app). Repeat times are stored as local wall-clock time, not UTC.

## Authentication

- Flow: the Next.js **server** logs in against `be-todo` (`loginAction`) and stores the API's JWT in an **httpOnly** cookie (`session`, 7 days = the token's lifetime, so a reload or browser restart stays signed in until Log out or expiry). Client JavaScript never sees the token; all API calls are server-side and attach it as `Authorization: Bearer` (`src/lib/api/client.ts`).
- **Public routes** (`PUBLIC_ROUTES` in constants): `/` (landing) and `/login`. Everything else is protected:
  - `src/proxy.ts` (Next 16 Proxy) redirects to `/login?next=...` when the cookie is missing/expired. This is an *optimistic* check only (no signature verification).
  - The real boundary is the API: a 401 makes `apiRequest` `redirect()` to `/login`. Server Actions' `mutate()` calls `unstable_rethrow` so that redirect isn't swallowed.
  - Protected pages needing the user call `requireUser()` (`features/auth/dal.ts`); it asks the API (`GET /auth/me`) and is memoized per request.
- Route groups: `app/(public)/` (wide header, landing + login) and `app/(app)/` (narrow `PageContainer`: `(todos)` tabs + `settings`). Header/CTA read the cookie via `hasActiveSession()` inside `<Suspense>`.
- Anything that reads the current time next to the session (`Date.now()` in expiry checks) must `await connection()` first (Cache Components rule).
- `?next=` is validated with `safeRedirectPath` (same-site paths only: prevents open redirects).
- Logging out deletes the cookie (`logoutAction`) and returns to `/`. Don't store tokens in `localStorage` or readable cookies.
- Dev seed logins are in `be-todo/src/constants/seed.constants.ts`. There is no register page yet.

## Next.js MCP (dev tools)

`.mcp.json` registers `next-devtools-mcp`, which connects to the running dev server's `/_next/mcp` endpoint. With `npm run dev` running and the page open in a browser, prefer its tools (`nextjs_index`, `nextjs_call` with `get_errors`, `get_routes`, `get_compilation_issues`, `get_logs`) to diagnose runtime/build errors instead of guessing or running `next build`. `nextjs_docs` points at the version-matched docs in `node_modules/next/dist/docs/`.

## Structure

```
src/app/                 routes only (page, layout, error, loading)
src/components/ui/       generic, reusable primitives (Button, Card, TextField, ...)
src/components/layout/   app shell (Header, Background, Logo)
src/features/<name>/     feature code: api.ts, actions.ts, types.ts, components/
src/lib/                 tiny framework-agnostic helpers (cn)
src/constants/           ALL shared constants (see below)
```

## UI and components

Before creating or changing any component or UI, read [.claude/skills/ui-components/SKILL.md](.claude/skills/ui-components/SKILL.md). Summary: small, single-purpose, reusable components; semantic theme tokens (never hard-coded colors); light + dark themes always work; animate with CSS and respect reduced motion.

## Constants

All reusable or meaningful constants live in `src/constants/` and are imported from `@/constants`. Never leave magic values inline: put them there.

- `app.constants.ts` (app name, API URL default), `routes.constants.ts` (`ROUTES`, `API_PATHS`), `todo.constants.ts` (limits, filter options, empty-state copy, animation timings), `messages.constants.ts` (`MESSAGES`: user-facing/error text), `theme.constants.ts` (storage key, theme list).
- Add new constants to the matching file (or a new `<domain>.constants.ts`) and re-export it from `index.ts`.
- Constants must be plain modules: no `"use client"`/`"use server"` (they are used on both sides).
- Keep UI strings that are reused or are error/status messages in `MESSAGES`; use `as const` objects instead of enums.
