---
name: ui-components
description: Rules for creating or changing React components and UI in fe-todo. Use whenever adding a component, page section, styling, animation, or theme-related change.
---

# UI & component rules (fe-todo)

Follow these every time you create or edit UI. Look at existing components in `src/components/ui/` first and **reuse or extend** before writing a new one.

## 1. Small, reusable components
- One component = one job. If a file passes ~100 lines or mixes data, state and markup, split it.
- Generic building blocks (no todo knowledge) go in `src/components/ui/`. Feature-specific ones go in `src/features/<feature>/components/`. App shell goes in `src/components/layout/`.
- One component per file, kebab-case filename, named export (`export function Card`). Default exports only for Next.js route files.
- Props: typed, minimal, composable. Extend native props with `ComponentProps<"button">` and spread `...props`; accept `className` and merge with `cn()` from `@/lib/cn`. React 19: `ref` is a normal prop, no `forwardRef`.
- Presentational components take data and callbacks via props. Data fetching lives in Server Components (`*-section.tsx`); state and optimistic logic live in one client "board/container" component per feature.
- Icon-only controls must use `IconButton` (requires `label`). Add new icons to `components/ui/icons.tsx`.
- Repeated markup 2+ times → extract a component.

## 2. Server vs client
- Default to Server Components. Add `"use client"` only on the smallest leaf that needs state, effects or handlers.
- Do not import server-only code into client files. Constants shared by both go in plain modules.
- Uncached async work must be inside `<Suspense>` with a skeleton fallback (cacheComponents is enabled). Read `node_modules/next/dist/docs/` before using a Next.js API.

## 2b. Reusable patterns already in the repo (reuse, don't re-invent)
- **Modals / forms:** use `components/ui/dialog.tsx` (native `<dialog>`; children mount only while open so form state resets). One dialog serves create *and* edit (`features/todos/components/todo-dialog.tsx` + `todo-form.tsx`). Form rows use `Field`, quick choices use `Chip`.
- **Time-dependent or locale-dependent UI** (relative dates, "overdue", `Intl` formatting): read time with `useNow()` (`features/todos/use-now.ts`, returns `null` on the server) and render nothing until it is non-null, to avoid hydration mismatches.
- **Shared mutation logic** lives in hooks (`use-todo-actions.ts`, `use-todo-editor.ts`), not copied into each board.
- Dates: use helpers in `src/lib/date.ts`. Due dates are stored as UTC ISO; date-only means "end of that local day".
- Next.js 16 keeps previous routes' DOM mounted but hidden: in e2e tests use `:visible` locators.

## 2c. Responsive (mobile-first, required)
- Write base classes for phones (320-430px), then add `sm:` (640) / `md:` / `lg:` upgrades. Never design desktop first.
- No horizontal page scroll at 320px. Use `min-w-0` on flex/grid children that hold text or inputs, `break-words` for user text, `whitespace-nowrap` on pills/buttons so they wrap as units.
- Touch: interactive targets >= 36-40px; never hide actions behind hover only. Use `pointer-fine:` to apply hover-reveal only on mouse devices (touch/tablet always show them).
- Inputs use `text-base sm:text-sm` (16px on mobile prevents iOS zoom on focus).
- Modals are bottom sheets on phones and centered from `sm:` (see `ui/dialog.tsx`); cap height with `dvh` units and allow inner scroll.
- Fixed elements (FAB, sticky bars) respect `env(safe-area-inset-*)`; keep `pb-28` on `<main>` so content is never hidden behind the FAB.
- Tab/segment bars must fit on one row at 320px (see `todo-tabs.tsx`: equal-width grid, corner count badges on mobile).
- Verify at 320, 375, 768 and 1280 widths before finishing.

## 3. Theming (light / dark)
- Theme = `data-theme="light|dark"` on `<html>`, set before paint by `features/settings/theme-script.tsx`; preference (light/dark/system) is stored in `localStorage` and managed by `features/settings/theme-store.ts`; UI is on `/settings`.
- **Only use semantic tokens**: `bg-background`, `bg-surface`, `bg-surface-muted`, `border-border`, `text-foreground`, `text-muted`, `text-primary`, `bg-primary`, `text-danger`, `text-success`, accent `accent`, `shadow-card`. They are defined in `src/app/globals.css` for both themes.
- Never hard-code colors (`#fff`, `bg-white`, `text-zinc-900`) and avoid `dark:` variants: tokens already switch. If a new color is needed, add a token to both `:root` and `[data-theme="dark"]` and to `@theme inline`.
- Verify every new UI in both themes.

## 4. Styling & layout
- Tailwind v4 utilities only; no CSS-in-JS, no inline colors. Mobile-first, then `sm:` and up.
- Rounded (`rounded-xl` / `rounded-2xl`), soft borders, subtle shadows, generous spacing; primary actions use the primary→accent gradient (see `Button`).
- Accessibility: semantic elements, visible `focus-visible` outline, accessible names on all controls, `role="alert"` for errors, sufficient contrast.

## 5. Animation
- Prefer CSS: keyframes and `--animate-*` tokens live in `globals.css` (`animate-fade-up`, `animate-item-in`, `animate-pop`, `animate-shimmer`, ...). Add new ones there, not inline.
- Animate `transform` / `opacity` (not layout properties). Typical durations 150–500ms, ease-out. Stagger with `style={{ animationDelay }}`.
- Interactions: hover/active feedback (`active:scale-95`), smooth state transitions (`transition-all duration-200`).
- `prefers-reduced-motion` is handled globally in `globals.css`; do not bypass it.
- Loading states use `Skeleton` that matches the final layout.

## 6. Constants
- No magic values in components: routes, labels lists, limits, messages, animation timings, storage keys go in `src/constants/` (import from `@/constants`). See CLAUDE.md "Constants".

## 7. Checklist before finishing
- [ ] Reused existing ui primitives; new component is small and generic where possible
- [ ] Works in light and dark; no horizontal scroll at 320px; usable by touch
- [ ] No inline magic strings/numbers: moved to `src/constants/`
- [ ] Keyboard + screen-reader friendly
- [ ] `npm run lint` and `npm run build` pass
