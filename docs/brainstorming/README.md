## BrainStorming README

## Plan V2 ✅ Executed

### Current Situation -
- List, Add, Edit, Import JSON, About, ErrorBoundary

### Before we go futher
#### Review
- [x] Add — ok
- [x] List — search icon, 7 date filters (week/month/12mo/FY/custom), category filter, search
- [x] Import — `validateImportData()` with date, category, amount validation + size limits
- [x] Edit — inline edit via `/add` route with router state (replaced devMode editing)

#### Add tests
- [x] Unit tests for store, localStorage, validation, categories
- [x] Component tests for ExpenseList (filters, search, render, totals)

#### Add New Expense
- [x] Reset button (icon) to reset form state
- [x] Amount preset bubbles (+10, +20, +50, +100, +200, +500)

#### About section
- [x] About section with app info and CONFIG.VERSION

#### Documentation
- [x] remove cloud-selection.md
- [x] remove failed-gh-deploy
- [x] remove idea_v1_css.md
- [x] keep their gist

**Documentation Archive (Gists)**:
- **Cloud Selection**: Supabase (PostgreSQL) is the chosen architecture over Firebase. Better suited for relational data (Category Trees) and future Go CLI/Desktop integrations.
- **Failed GH Deploy**: GitHub Pages Action failed with 404; requires manual enabling in GitHub Repository Settings -> Pages.
- **Obsidian Lantern Design**: High-end urban night editorial UI. Uses `#131313`, `#FFC107`, Manrope typography. Defined by the "no-line" rule (ghost borders, heavy glassmorphism) and asymmetrical floating layouts.

#### Github Actions
- [x] CI pipeline: install, lint, test, build, deploy to GitHub Pages

### Future
- Phase 1.9: localStorage cleanup mechanism, data export
- Phase 2: Cloud sync (Supabase)

