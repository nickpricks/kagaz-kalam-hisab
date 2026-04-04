# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kagaz Kalam Hisab — a local-first expense tracker PWA built with React 19, TypeScript, Vite 8, and Tailwind CSS v4. Currently at v0.0.2 (fix/review-bugs-batch1 branch). Currency is ₹ (Indian Rupee).

## Commands

```bash
bun run dev          # Dev server on port 3000
bun run dev:host     # Dev server accessible on LAN
bun run build        # TypeScript check + Vite production build
bun run lint         # ESLint on all .ts/.tsx
bun run test         # Vitest via package.json script — DO NOT use `bun test` (Bun's native runner, bypasses vitest + jsdom config)
bun run preview      # Preview production build
```

Package manager is **Bun** (not npm/yarn).

## Architecture

```
src/
  components/     # React view components (AddEntry, ExpenseList, BulkImport, etc.)
  hooks/          # Custom React hooks (useExpenseFilters)
  data/           # Data layer: types.ts (Expense, CategoryDefinition), store.ts (CRUD), categories.ts
  utils/          # localStorage helpers, validation
  helpers/        # Navigation helpers, string utils, date utils
  constants/      # Config.ts (app settings, storage keys), AppRoutes.ts (route paths), Messages.ts (user-facing strings)
  __tests__/      # Vitest tests (store, validation, component tests with jsdom)
```

**Data flow**: Components call `store.ts` functions → store reads/writes `localStorage` via `utils/localStorage.ts` → data validated by `utils/validation.ts`.

**Key patterns**:
- Hard delete + undo toast: `deleteExpense` physically removes records and returns the removed expense for undo. Legacy soft-deleted records (`isDeleted: true`) still filtered by `getExpenses()`.
- IDs via `crypto.randomUUID()`, timestamps as ISO 8601.
- Dates stored as `YYYY-MM-DD` strings.
- Storage key defined once in `CONFIG.STORAGE_KEYS.EXPENSES` — always import from there, never hardcode.
- All store write functions must propagate `saveToStorage`'s boolean return to callers — see `addExpense`/`updateExpense` as the pattern.
- Router `location.state` is untyped at runtime — use a runtime validator before reading it. See `parseEditExpense()` in `AddEntry.tsx`.
- Currency symbol: always use `CONFIG.CURRENCY_SYMBOL` — never use `\u20B9` in JSX text (unicode escapes don't resolve in JSX text nodes).
- ExpenseList category filter uses tappable emoji bubble buttons (not a `<select>`), toggling on re-click. Emoji-only by default, pill expands to show full label on select.
- AddEntry categories also use emoji-only bubbles with pill expand. Both category and sub-category support deselect via re-tap.
- Default date filter is `current_month` (not `all`). Tests must use dates within the current month.
- Amount presets: primary row `[10,20,50,100,200]` + expandable extended row via `···` button. Reset collapses extended row.
- User-facing error/validation strings live in `constants/Messages.ts` (`ValidationMsg`, `ImportMsg`) — don't inline new strings in components.

## Routing

React Router v7 with hash routing. Default route redirects to `/list`. Routes defined in `constants/AppRoutes.ts`: `/add`, `/list`, `/import`, `/about`. The `/add` route doubles as edit — `ExpenseList` navigates to it with `{ state: { editExpense } }` and `AddEntry` detects edit mode via `location.state`.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. Custom theme in `src/index.css` with `@theme` directive — dark obsidian background (#131313), gold accents (#FFC107), Manrope font. Glass-morphism utilities: `.glass-panel`, `.glass-card`, `.btn-primary`, `.btn-ghost`, `.input-field`.

## Build & Deploy

- Production base path: `/kagaz-kalam-hisab/` (GitHub Pages)
- CI: GitHub Actions on push to `master` — install, test, build, deploy
- PWA configured via `vite-plugin-pwa` with prompt-based update (`ReloadPrompt` component in App.tsx). Type `vite-plugin-pwa/react` registered in `tsconfig.app.json`.

## Testing

`bun run test` runs Vitest. Component tests (`.test.tsx`) use `@testing-library/react` + jsdom, configured via `test.environmentMatchGlobs` in `vite.config.ts`. Data-layer tests (`.test.ts`) mock `window` manually and run in the default node environment — the two environments must stay separate.

## TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled. Target ES2023.

## Documentation

Planning docs live in `docs/brainstorming/` (not `docs/brainstorm/`). `docs/plans/implementation_idea_v1.md` tracks phase progress. Update docs when making architectural changes.

## Reviews

Review reports in `docs/reviews/`. `reviews.md` is the active issue tracker (Nick review + AFP cross-reference). `REVIEW_CONSOLIDATED.md` has historical agent review findings. Check `reviews.md` before starting fix work.

## Commit Convention

When requesting commit approval, include a concise summary of changes and list all modified/created files (git-status style).

## Git Workflow

- Always create a feature branch before editing source files — never edit directly on master.
- Commit code changes and documentation changes separately.
