# Review Tracker

## Nick Review — 2026-04-04

Bugs and suggestions from manual review.

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 1 | Add categories design — emoji-only bubbles, expand to pill on select | ✅ Fixed | Compact emoji circles in AddEntry + ExpenseList, pill expand on select with `aria-label` |
| 2 | Select category — deselect does not work | ✅ Fixed | AddEntry category toggle: re-tap deselects |
| 3 | Select category → select sub-cat → deselect — clicking category bubble deselects sub-cat | ✅ Fixed | Sub-cat toggle added, category deselect clears sub-cat |
| 4 | Amount bubbles — remove 500 from primary row, expand extended range | ✅ Fixed | Primary: `[10,20,50,100,200]`, Extended: `[0.1,0.2,0.5,1,2,5,500,1000,2000,5000,10000]` |
| 5 | After add — expected amounts remain open, but reset form should close them | ✅ Fixed | `handleReset` now calls `setShowMoreAmounts(false)` |
| 6 | About page version update | ✅ Fixed | Bumped to 0.0.2 in package.json, Config.ts, CHANGELOG |
| 7 | GitHub link needs repo link | ✅ Fixed | Changed to `nickpricks/kagaz-kalam-hisab` |
| 8 | Feedback email needs changed | ✅ Fixed | Updated to `niteshkac+github@gmail.com` |

## AFP 20-Point Review — Applicable to Finularity

Patterns from the AFP code review (2026-04-02) that also apply here.

| # | AFP Point | Finularity Status | Notes |
|---|-----------|-------------------|-------|
| 3 | Keep package.json commands separate, no `&&` chaining | ✅ OK | Scripts already use separate commands |
| 4 | All constants from config, deriving from .env | ✅ OK | `CONFIG` in `constants/Config.ts` pulls from env |
| 5 | Routes should be an enum | ✅ Fixed | Removed unused `AppRoute` type; `as const` kept (enum blocked by `erasableSyntaxOnly`) |
| 6 | Standard errors/messages as enum/constant | ✅ Fixed | `constants/Messages.ts` with `ValidationMsg` and `ImportMsg` |
| 8 | Types need a dedicated place | ✅ OK | `data/types.ts` has core types |
| 9 | No `\|\|` fallbacks — use `??` with proper config | ✅ OK | Config uses `??` with env defaults |
| 10 | Storage keys as constants | ✅ OK | `CONFIG.STORAGE_KEYS` |
| 12 | Regex in utils file | 🔲 Open | Validation regexes inline in `validation.ts` — could extract |
| 13 | Date functions centralized | ✅ OK | `helpers/dateUtils.ts` |
| 14 | Arrow functions — explicit return for exported functions | 🔲 Open | Mixed style across components |
| 17 | No ternary in TSX — use `cond && ...` pattern | 🔲 Open | Ternaries used in JSX throughout |
| 18 | Function names should describe what they do | ✅ OK | `calculateTotal`, `handleReset`, etc. are descriptive |
| 19 | Number parsing / validation in utils | ✅ OK | `validation.ts` has `validateExpenseInput` |
| 20 | Keep types/constants/utils centralized | ✅ OK | Organized under `data/`, `constants/`, `utils/`, `helpers/` |
