# Phase 1 — Kagaz Kalam Hisab (Implementation Roadmap & Plan)

This document serves as the project's living roadmap and finalized implementation record.

---

## 🗺️ Roadmap

### [ ] Phase 1.9: Before we begin Cloud Sync etc
- [ ] **Clean Up**: Mechanism to remove local storage data. We can confirm user - wheather to copy to cloud or remove it and reset progress.
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

### [x] Phase 1.5: Plan V2 Refinements ✅
- [x] **Add Flow**: Accumulating amounts, mandatory field validation, and form reset.
- [x] **List Flow**: Full-text search and advanced date/category filters.
- [x] **UX**: Standard Routing via `HashRouter` and `devMode` item editing.
- [x] **Quality**: Unit tests (Bun) and JSON validation layer for imports.

### [x] Phase 1: Local Storage MVP ✅
- [x] **Foundational**: Vite + React + TS scaffolding.
- [x] **Persistence**: `localStorage` store with soft-delete support.
- [x] **UI**: Dark-mode-first dashboard with day-wise totals.
- [x] **Import**: Basic JSON bulk import capability.

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

### Category Tree (Verified)
- **Food** → Milk, Snacks, Groceries, Healthy, Orders
- **Shopping** → Veggies, Fruits, Fashion, Ration, Electronics
- **Travel** → Air, Train, Bus, Road Toll
- **Vehicle** → Fuel, Maintenance, Washing
- **Bills** → Phone, Internet, Subscriptions, Entertainment, Rent, Electricity, Society, Insurance
- **Medical** → Doctor/Consultation, Medicines, Tests
- **Care** → Personal, Grooming, Massage
- **Gifts** → Ceremonies, Charity, Donations
- **Education** → Courses, Books
- **Misc**
