# Design Analysis: Obsidian Lantern Theme

**Date**: 2026-03-27 | **Branch**: `master` | **Status**: All 14 improvements implemented

---

## Identity

**Obsidian Lantern** — urban night editorial. `#131313` obsidian base, `#FFC107` amber gold accent, Manrope sans + DM Serif Display for hero numbers. Defined by the "no-line rule" (ghost borders at 15% opacity, depth via blur/shadow) and asymmetrical floating layouts.

---

## Color Tokens

| Token | Hex | Role |
|---|---|---|
| `background` / `surface` | `#131313` | Obsidian base |
| `surface-container-low` | `#1c1b1b` | Glass panels |
| `surface-container-high` | `#2a2a2a` | Glass cards, chips |
| `primary` | `#ffe4af` | Warm gold text |
| `primary-container` | `#FFC107` | Hero amber — active states, glow, CTA |
| `secondary` | `#e4c27c` | Muted gold — subcategory |
| `on-surface` | `#e5e2e1` | Body text |
| `on-surface-variant` | `#a1a1aa` | Labels, secondary |
| `outline-variant` | `#4f4632` | Ghost border tint |

**Shadow tokens**: `obsidian-glass`, `glow-primary` (+ `subtle`, `medium`, `strong`, `intense` variants).

---

## Typography

- **Sans**: Manrope — all UI text, labels (`uppercase` + `tracking`)
- **Display**: DM Serif Display — hero amount numbers only (balance, amount input)
- Hierarchy via **size + tracking**, not weight

---

## Key Components

| Component | Pattern |
|---|---|
| `.glass-panel` | `backdrop-blur-3xl` + ghost border + obsidian shadow |
| `.glass-card` | Same, hover shifts background not border |
| `.btn-primary` | Gold gradient + glow bloom + scale on hover |
| `.btn-ghost` | `::after` underline slides in on hover |
| `.input-field` | Bottom-border only, rounded top |

---

## Atmospheric Layers

All below 20% opacity, behind UI at negative z-index:
- **Ambient glow** — 2 blurred gold circles (`blur-[120px]`)
- **Noise texture** — SVG fractalNoise at 3%, film grain
- **Light trails** — 5 animated SVG dash lines, staggered delays
- **City skyline** — 14 building silhouettes + 7 flickering gold windows

---

## WCAG Contrast (all text passes AA)

| Lowest ratio | Pair | Result |
|---|---|---|
| 5.6:1 | `on-surface-variant` on `surface-high` | AA pass |
| 7.2:1 | `on-surface-variant` on `background` | AAA pass |
| 11.4:1 | `primary-container` on `background` | AAA pass |
| 14.4:1 | `on-surface` on `background` | AAA pass |

Ghost borders intentionally fail contrast — atmospheric, not functional.

---

## Improvements Log (all complete)

| # | Category | Fix |
|---|---|---|
| 1 | Token | Defined `animate-fade-in` keyframes |
| 2 | Token | Replaced 6 hardcoded `#131313` with `bg-background` |
| 3 | Token | `bg-noise` z-index `z-50` → `z-[1]` |
| 4 | Token | `theme-color` meta aligned to `#FFC107` |
| 5 | A11y | `prefers-reduced-motion` suppresses all animations/transitions |
| 6 | A11y | Contrast audit passed; input border bumped to 30% |
| 7 | A11y | `:focus-visible` gold outline added globally |
| 8 | Design | DM Serif Display for hero numbers |
| 9 | Design | Skyline window flicker (8s staggered cycle) |
| 10 | Design | Empty state: dimmed lantern SVG icon |
| 11 | Design | Page transitions: `animate-page-enter` on route change |
| 12 | Design | Scroll-aware header: opacity + shadow shift at 20px |
| 13 | Token | 4 glow shadow tokens; inline rgba consolidated |
| 14 | Token | DevInspector converted to Tailwind + glass-panel |
