# Changelog

All notable changes to Kagaz Kalam Hisab are documented here.

## [Released]

### Files Changed

| File | State | Change |
|------|-------|--------|
| `src/components/AddEntry.tsx` | ✅ Committed | Emoji-only categories, deselect toggle, reset collapse, amount presets |
| `src/components/ExpenseList.tsx` | ✅ Committed | Emoji-only category filter bubbles with aria-label |
| `src/components/About.tsx` | ✅ Committed | GitHub repo link + feedback email fixed |
| `CHANGELOG.md` | ✅ Committed | Added unreleased entries for all review fixes |
| `docs/reviews/reviews.md` | ✅ Committed | Rewritten review tracker with AFP cross-reference |

### Added
- **PWA update prompt**: Switched from silent `autoUpdate` to `prompt` strategy with a reload toast (`ReloadPrompt` component) matching the existing undo-toast design.
- **Category bubble filter**: ExpenseList now shows tappable category pills instead of a dropdown. Click to filter, click again to deselect.
- **Amount "more" menu**: `···` button on AddEntry expands an extended preset row.
- **Bills subcategories**: Added "Gas" and "Tax" under Bills.
- **Dynamic spend label**: Header shows contextual label ("Spent This Month", "Spent Today", etc.) based on selected date filter.
- **Emoji-only category design**: Categories in AddEntry and ExpenseList now show as compact emoji circles that expand into pills with the full label on select. `aria-label` for accessibility.

### Changed
- Default list timeframe changed from "All Dates" to "Current Month".
- Header label changed from "Total Balance" to dynamic "Spent [timeframe]".
- Amount presets: primary row now `[10,20,50,100,200]` (removed 500), extended row expanded with `[500,2000]` added.
- About page GitHub link now points to repo (`nickpricks/kagaz-kalam-hisab`).
- About page feedback email updated to `niteshkac+github@gmail.com`.

### Fixed
- Amount label on AddEntry showed literal `\u20B9` instead of ₹ — now uses `CONFIG.CURRENCY_SYMBOL`.
- Category deselect in AddEntry — re-tapping a selected category now deselects it.
- Sub-category deselect — re-tapping a selected sub-category now deselects it.
- Reset form button now collapses the extended amount presets row.

### Planned (Phase 1.9)
- Configurable default timeframe (user preference persisted in localStorage).
- Payment method indicator (credit card vs account).
- Incoming funds / income tracking.

## [0.0.1] — 2025-03-27

- Initial LocalStorage MVP: Add, List, Edit, Delete (with undo), Bulk Import.
- Category tree with subcategories.
- Date/category/search filtering.
- Dark obsidian theme with glass-morphism UI.
- PWA with offline support.
- GitHub Pages deployment via CI.
