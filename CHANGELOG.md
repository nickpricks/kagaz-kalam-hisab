# Changelog

All notable changes to Kagaz Kalam Hisab are documented here.

## [Unreleased]

### Added
- **PWA update prompt**: Switched from silent `autoUpdate` to `prompt` strategy with a reload toast (`ReloadPrompt` component) matching the existing undo-toast design.
- **Category bubble filter**: ExpenseList now shows tappable category pills instead of a dropdown. Click to filter, click again to deselect.
- **Amount "more" menu**: `···` button on AddEntry expands an extended preset row (0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5, 1000, 5000, 10000).
- **Bills subcategories**: Added "Gas" and "Tax" under Bills.
- **Dynamic spend label**: Header shows contextual label ("Spent This Month", "Spent Today", etc.) based on selected date filter.

### Changed
- Default list timeframe changed from "All Dates" to "Current Month".
- Header label changed from "Total Balance" to dynamic "Spent [timeframe]".

### Fixed
- Amount label on AddEntry showed literal `\u20B9` instead of ₹ — now uses `CONFIG.CURRENCY_SYMBOL`.

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
