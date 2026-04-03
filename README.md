# KAGAZ KALAM HISAB
kagaz kalam dawat la; aa pura kare hisab

A local-first expense tracker PWA. Dark obsidian theme, glass-morphism UI, ₹ currency.

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Bun · vite-plugin-pwa

## Features

- Add/edit/delete expenses with undo
- Category tree with subcategories (Food, Shopping, Travel, Vehicle, Bills, Medical, Care, Gifts, Education, Misc)
- Tappable category bubble filter + date range filters (today, week, month, FY, custom)
- Quick-add amount presets with expandable extended row
- Bulk CSV import
- PWA with offline support and update prompt
- Dynamic "Spent This Month / Today / ..." header

## Quick Start

```bash
bun install
bun run dev        # http://localhost:3000
bun run test       # Vitest
bun run build      # Production build
```

## Roadmap

1. [x] Phase 0: Project Setup & Goal Definition
2. [x] Phase 1: Local Storage MVP (Add, List, Bulk Import)
3. [ ] Phase 1.9: Configurable defaults, payment methods, income tracking
4. [ ] Phase 2: Cloud Sync (Firebase/Supabase)
5. [ ] Phase 3: Go-based CLI App
6. [ ] Phase 4: Desktop App (Go/Wails)
7. [ ] Phase 5: Android App (React Native/Expo)

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.
