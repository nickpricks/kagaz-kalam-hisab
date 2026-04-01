# Agent: Mohit Sharma (the-drill-sergeant — Mentor Mode)
## Full Codebase Review — Constructive Mentorship

**Focus**: SOLID principles, testing strategy, growth opportunities
**Commit**: f294d55 on master
**Date**: 2026-04-01

---

## Strengths — What You're Doing Well

**Testing went from 7 to 47 tests with proper isolation.** Counter-based UUID mock, coverage of edge cases (corrupted JSON, QuotaExceededError), structured test suites. The localStorage test covering SecurityError paths shows you're thinking about real-world failure modes. This is a massive leap.

**HashRouter migration was surgical.** Changed the router, updated hash param parsing in `getQueryString()`. Exactly the right level of focused fix.

**The Obsidian Lantern theme is genuinely impressive for v0.0.1.** `prefers-reduced-motion` media query, `:focus-visible` outlines, glow shadow tokens, scroll-aware header, empty state with lantern SVG. These are polish details most senior devs forget.

**Clean data layer separation.** `types.ts` → `store.ts` → `localStorage.ts` — clear boundaries that will serve the IndexedDB/backend migration.

**TypeScript strict mode is properly strict.** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` — stricter than most production apps.

**Well-documented interfaces.** Field-level JSDoc on `Expense` with format specs. Most functions have `@param`/`@returns`.

**Soft delete pattern.** `isDeleted` flag with `getAllExpensesRaw()` for debug/restore — mature choice for financial data.

**Indian FY support.** April-to-March fiscal year filters show you're building for a real user.

---

## Findings

### HIGH

**1. `as any` Type Cast on Delete Path**
- File: `src/data/store.ts:73`
- `{ isDeleted: true } as any` — unnecessary, suppresses type checking. Quick win from prior review, still present.
- **How to improve**: Delete `as any`. The type is already correct.

**2. Cascading Silent Failure Architecture (C2)**
- Files: `src/utils/localStorage.ts`, `src/data/store.ts`
- `saveToStorage` returns void on success AND failure. `addExpense` always returns the expense. For v0.0.1 personal use, survivable — but this is the foundation issue that becomes painful to retrofit.
- **How to improve**: Start with `saveToStorage` returning `boolean`. Make `addExpense` check it. You don't need a fancy discriminated union on day one.

**3. Import Validation Bypass (C3/C4)**
- Files: `src/data/store.ts:81-109`, `src/components/BulkImport.tsx`
- Strict validation + lenient coercion running in parallel. Future callers bypass validation entirely.
- **How to improve**: Refactor to `importExpenses(data: Expense[])` where caller handles parsing/validation.

**4. Date Timezone Bug**
- File: `src/components/ExpenseList.tsx:57-92`
- UTC vs local midnight. "Today" filter uses string comparison (correct). Other filters use Date objects (broken).
- **How to improve**: Use string comparisons for all filters (lexicographic comparison works for ISO dates).

**5. No Error Boundary**
- File: `src/App.tsx`
- Corrupted data → render crash → white screen → no recovery.
- **How to improve**: Wrap Routes in error boundary. Offer recovery UI.

**6. Duplicated Storage Key**
- Files: `src/data/store.ts:9`, `src/constants/Config.ts:11`, `src/App.tsx:62`
- Three locations, one canonical constant ignored.
- **How to improve**: Import `CONFIG.STORAGE_KEYS.EXPENSES` everywhere. Delete local constant.

### MEDIUM

**7. No useMemo on ExpenseList Computations**
- File: `src/components/ExpenseList.tsx:47-119`
- Full filter/group/sort on every render. Fine for 50 expenses, janky at 1,000+.
- **How to improve**: `React.useMemo` with `[props.expenses, searchTerm, dateFilter, customDateRange, categoryFilter]`.

**8. process.env.KEY Still in Client Bundle**
- File: `vite.config.ts:45`
- Dead config, latent security risk. If anyone sets `KEY=secret`, it ships to browsers.
- **How to improve**: Remove the `define` block. Use `VITE_` prefix convention.

**9. Dead Files Committed**
- `src/App.css` (184 lines), `debug_store.ts`
- Superseded by index.css and proper tests.
- **How to improve**: Delete both.

**10. stings.ts Filename Typo**
- File: `src/helpers/stings.ts`
- Missing 'r'. JSDoc says `strings.ts`.
- **How to improve**: Rename and update imports.

**11. No Runtime Type Validation on localStorage Reads**
- File: `src/utils/localStorage.ts:28`
- `as T` is a compile-time lie. `.filter()` on non-array crashes.
- **How to improve**: Add `Array.isArray()` guard. Consider `zod` for the parse step long-term.

**12. Soft-Deleted Records Never Purged**
- File: `src/data/store.ts`
- Unbounded growth toward 5MB limit.
- **How to improve**: Add `purgeDeleted()` function. Expose in settings.

**13. No Schema Versioning**
- Files: `src/utils/localStorage.ts`, `src/data/types.ts`
- No `dataVersion` field. Schema changes break existing users.
- **How to improve**: Store version number, add migration functions.

**14. ExpenseList SRP Violation**
- File: `src/components/ExpenseList.tsx` (289 lines)
- Handles: search, 7 date filters, category filters, FY calculations, grouping, totals, rendering, delete, dev-mode edit.
- **How to improve**: Extract `useExpenseFilters` hook, `FilterBar` component, `ExpenseCard` component.

**15. No Component Tests**
- All 47 tests on data layer. Zero React component tests. Most complex code (date filtering) untested.
- **How to improve**: Start with 3-5 tests for ExpenseList filtering using `@testing-library/react`.

**16. @/ Path Alias Non-Functional**
- `vite.config.ts:49` vs missing tsconfig paths.
- **How to improve**: Add paths to tsconfig or remove alias.

### LOW

**17. Hardcoded v0.0.1 in About.tsx**
- `CONFIG.VERSION` exists but unused.

**18. Mixed Export Styles**
- Named + default exports. Only named imports used.

**19. .env.example Firebase/Supabase Confusion**

**20. DevInspector `data: any` Prop**
- File: `src/components/DevInspector.tsx:9`
- `unknown` or `Record<string, unknown>` would be more honest.

**21. No meta description in index.html**

**22. BulkImport.tsx Missing @file Header**

---

## Progress Since Last Review

| Prior Issue | Status |
|---|---|
| C1: BrowserRouter 404 | **FIXED** |
| M7: animate-fade-in | **FIXED** |
| M14: bg-noise z-index | **FIXED** |
| H10: Test isolation | **FIXED** |
| H9: Only 7 tests | **FIXED (47 now)** |
| L6: Hardcoded colors | **FIXED** |

Real, measurable progress. Priorities were correct: routing fix was highest-impact, test expansion was highest-value.

---

## Growth Roadmap

**Tier 1 — Quick wins (15 minutes):**
1. Remove `as any` from deleteExpense
2. Delete App.css and debug_store.ts
3. Rename stings.ts → strings.ts
4. Remove process.env.KEY define
5. Use CONFIG.VERSION in About.tsx
6. Unify storage key references

**Tier 2 — Foundation fixes (1-2 hours):**
7. Fix date timezone bug with string comparisons
8. Make saveToStorage return boolean
9. Refactor importExpensesFromJSON to accept validated data
10. Add error boundary

**Tier 3 — Architecture (half-day):**
11. Extract ExpenseList into smaller components
12. Add useMemo
13. Schema versioning
14. purgeDeleted() function
15. Component tests

**Tier 4 — Polish (whenever):**
16. Runtime type guards on reads
17. Fix path alias
18. Clean up exports, .env, meta tags

---

The trajectory is strong. The main growth edge: shifting from "it works for me right now" to "it works reliably under adversarial conditions" — which is exactly the jump from junior to senior thinking.

## Summary

| Severity | Count |
|----------|-------|
| HIGH | 6 |
| MEDIUM | 10 |
| LOW | 6 |
| **Total** | **22** |
