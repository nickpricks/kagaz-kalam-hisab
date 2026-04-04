# Phase 1 — Kagaz Kalam Hisab (Implementation Roadmap & Plan)

This document serves as the project's living roadmap and finalized implementation record.

---

## 🗺️ Roadmap

### [ ] Phase 1.9: Before we begin Cloud Sync etc
- [ ] **Clean Up**: Mechanism to remove local storage data. We can confirm user - wheather to copy to cloud or remove it and reset progress.
- [ ] **Configurable default timeframe**: Let user pick their default list filter (current month, today, all, etc.) and persist the preference in localStorage.
- [ ] **Payment method & income**: Credit card vs account indicator on entries; incoming funds tracking.
### [ ] Phase 2: Cloud Sync (Supabase)
- [ ] **Infrastructure**: Set up Supabase project.
- [ ] **Authentication**: Implement User Login (Google/Email) to protect data.
- [ ] **Data Sync**: Move from `localStorage` to a hosted database (Firestore/PostgreSQL).
- [ ] **Conflict Resolution**: Implement "Local-First" sync logic to handle offline edits.
- [ ] **Sharing**: Add capability to share an expense group/book with another user.

### [ ] Phase 3: Go-based CLI App
- [ ] **Core**: Scaffold Go CLI using `cobra`.
- [ ] **Storage**: Implement SQLite or JSON file storage for CLI-local data.
- [ ] **Logic**: Ports filters, categories, and CRUD logic to Go.
- [ ] **Sync**: Add a `sync` command to pull/push data from/to Phase 2 cloud.

### [ ] Phase 4: Desktop App (Go/Wails)
- [ ] **Framework**: Use Wails to bridge Go logic with the React frontend.
- [ ] **Native**: Add tray icons, global shortcuts, and file system integration.
- [ ] **Offline**: Ensure full functionality without internet using local SQLite.

### [ ] Phase 5: Android App (React Native)
- [ ] **Port**: Adapt React UI for React Native / Expo.
- [ ] **Mobile features**: Add SMS parsing (optional/experimental) and biometric lock.
- [ ] **Sync**: Mobile-to-Cloud sync matching Phase 2 patterns.

---

### [x] Phase 1.9: Review Bugs Batch 1 ✅
- [x] **Emoji-only categories**: Compact emoji circles in AddEntry + ExpenseList, pill expand on select with `aria-label`.
- [x] **Category deselect**: Re-tap toggles off in both AddEntry (category + sub-cat) and ExpenseList.
- [x] **Amount presets**: Primary row `[10,20,50,100,200]`, extended row expanded with 500, 2000.
- [x] **Reset form**: Now collapses extended amount presets.
- [x] **About page**: GitHub link → repo URL, feedback email updated.
- [x] **Error constants**: `Messages.ts` with `ValidationMsg` and `ImportMsg` — no more inline strings.
- [x] **Routes cleanup**: Removed unused `AppRoute` type.

### [x] Phase 1.8: Review Fixes & Architecture ✅
- [x] **Edit Flow**: Inline edit via `/add` route with router state (replaces devMode editing).
- [x] **Hard Delete**: `deleteExpense` physically removes records + undo toast (5s). Replaces soft-delete for new records.
- [x] **Filters Hook**: `useExpenseFilters` custom hook extracted from ExpenseList (filter/group/sort with useMemo).
- [x] **Component Tests**: ExpenseList tests with @testing-library/react + jsdom (6 tests).
- [x] **Security**: Runtime validation on `location.state`, `updateExpense` returns `{found, saved}`, tightened type signature.
- [x] **Data Integrity**: `saveToStorage` return value propagated through all store write paths. Date comparisons use local YYYY-MM-DD strings (no UTC bugs).

### [x] Phase 1.5: Plan V2 Refinements ✅
- [x] **Add Flow**: Accumulating amounts, mandatory field validation, and form reset.
- [x] **List Flow**: Full-text search and advanced date/category filters.
- [x] **UX**: Standard Routing via `HashRouter`, ErrorBoundary, schema versioning.
- [x] **Quality**: Unit tests and JSON validation layer for imports.

### [x] Phase 1: Local Storage MVP ✅
- [x] **Foundational**: Vite + React + TS scaffolding.
- [x] **Persistence**: `localStorage` store. Legacy soft-deleted records still filtered; new records use hard delete.
- [x] **UI**: Dark-mode-first Obsidian Lantern theme with day-wise totals.
- [x] **Import**: Bulk JSON import with validation, size limits, and deduplication.

---

## 📋 Technical Specs (Phase 1 Ref)

### Data Model
```typescript
interface Expense {
  id: string;          // crypto.randomUUID()
  date: string;        // "YYYY-MM-DD"
  category: string;    // main category key
  subCat: string;      // sub-category key
  amount: number;      // raw number
  note: string;        // optional free text
  isDeleted: boolean;  // soft delete flag
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;   // ISO 8601 timestamp
}
```

### Category Tree (15 categories — see `data/categories.ts` for source of truth)
- **Food** → Milk, Snacks, Groceries, Healthy, Orders, Beverages
- **Shopping** → Veggies, Fruits, Fashion, Ration, Electronics, Home Items
- **Travel** → Air, Train, Bus, Cab/Auto, Road Toll
- **Vehicle** → Fuel, Maintenance, Washing, Parking, Insurance
- **Bills** → Phone, Internet, Subscriptions, Electricity, Rent, Society, Gas, Water, Tax, Maintenance
- **Medical** → Doctor/Consultation, Medicines, Tests, Emergency
- **Care** → Grooming, Massage, Personal
- **Gifts** → Ceremonies, Charity, Donations, Family, Friends
- **Education** → Courses, Books, Software/Tools
- **Household** → Cleaning, Repairs
- **Finance** → Borrowed Given, Borrowed Taken, Loan EMI, Credit Card Payment, Investment
- **Entertainment** → Movies, Outings
- **Income** → Salary, Business, Interest, Refund, Other Income
- **Transfer** → Self Account, Wallet Transfer
- **Misc** → Misc
