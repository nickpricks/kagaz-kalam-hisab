# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kagaz Kalam Hisab — a local-first expense tracker PWA built with React 19, TypeScript, Vite 8, and Tailwind CSS v4. Currently at v0.0.1 (LocalStorage MVP). Currency is ₹ (Indian Rupee).

## Commands

```bash
bun run dev          # Dev server on port 3000
bun run dev:host     # Dev server accessible on LAN
bun run build        # TypeScript check + Vite production build
bun run lint         # ESLint on all .ts/.tsx
bun test             # Vitest (src/__tests__/)
bun run preview      # Preview production build
```

Package manager is **Bun** (not npm/yarn).

## Architecture

```
src/
  components/     # React view components (AddEntry, ExpenseList, BulkImport, etc.)
  data/           # Data layer: types.ts (Expense, CategoryDefinition), store.ts (CRUD), categories.ts
  utils/          # localStorage helpers, validation
  helpers/        # Navigation helpers, string utils
  constants/      # Config.ts (app settings, storage keys), AppRoutes.ts (route paths)
  __tests__/      # Vitest tests for store and validation
```

**Data flow**: Components call `store.ts` functions → store reads/writes `localStorage` via `utils/localStorage.ts` → data validated by `utils/validation.ts`.

**Key patterns**:
- Soft delete: expenses set `isDeleted: true`, never physically removed. `getExpenses()` filters these out.
- IDs via `crypto.randomUUID()`, timestamps as ISO 8601.
- Dates stored as `YYYY-MM-DD` strings.
- Path alias `@/` maps to project root (configured in vite.config.ts).

## Routing

React Router v7 with hash routing. Default route redirects to `/list`. Routes defined in `constants/AppRoutes.ts`: `/add`, `/list`, `/import`, `/about`.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. Custom theme in `src/index.css` with `@theme` directive — dark obsidian background (#131313), gold accents (#FFC107), Manrope font. Glass-morphism utilities: `.glass-panel`, `.glass-card`, `.btn-primary`, `.btn-ghost`, `.input-field`.

## Build & Deploy

- Production base path: `/kagaz-kalam-hisab/` (GitHub Pages)
- CI: GitHub Actions on push to `master` — install, test, build, deploy
- PWA configured via `vite-plugin-pwa` with prompt-based registration

## TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled. Target ES2023.

## Documentation

Planning docs live in `docs/brainstorming/` (not `docs/brainstorm/`). `WORKPLAN.md` tracks phase progress. Update docs when making architectural changes.

## Commit Convention

When requesting commit approval, include a concise summary of changes and list all modified/created files (git-status style).
