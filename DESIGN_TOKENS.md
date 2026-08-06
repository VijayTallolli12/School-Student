# Design Tokens — Reference

All tokens live in `src/design-system/`. Import from `@/design-system` or the
individual modules.

## Color tokens (`colors.ts`)

Palette **Iris** (brand violet), **Mint** (secondary), **Sunset** (accent),
neutrals **Basalt** (cool violet-tinted).

| Token | Light value | Purpose |
| ----- | ----------- | ------- |
| `brand`            | `#7C4DFF` | Primary actions, hero, focus |
| `brandDeep`        | `#582BCB` | Secondary CTA / emphasis |
| `secondary`        | `#2DB392` | Success-adjacent brand |
| `accent`           | `#FB5E1D` | Highlights, energy |
| `success`          | `#10B981` | Paid, present, passed |
| `warning`          | `#F59E0B` | Partial, due soon |
| `error`            | `#EF3D5B` | Absent, unpaid, failed |
| `info`             | `#06B6D4` | Homework, neutral info |
| `background`       | `#F7F6FC` | Screen background |
| `card`             | `#FFFFFF` | Card surface |
| `surfaceSubtle`    | `#F0EEF7` | Tinted fills |
| `surfaceSunken`    | `#E9E7F5` | Tracks, recessed |
| `border` / `divider` | `#E4E2F0` / `#EEECF7` | Hairlines |
| `text`             | `#1B1830` | Primary text |
| `textSecondary`    | `#5C5B78` | Body copy |
| `textMuted`        | `#A5A2BC` | Secondary meta |
| `textTertiary`     | `#9E9BB8` | Tertiary meta |
| `textDisabled`     | `#CDCBE0` | Disabled |
| `onBrand`          | `#FFFFFF` | Text on brand surfaces |
| `overlay`          | `rgba(19,16,34,.42)` | Modals/banners |

Dark theme surfaces live in `palette.dark`; `useTheme()` selects automatically.

**Semantic color rule:** use a semantic token (`success`, `warning`, `error`) for
data meaning; use `brand`/`secondary`/`accent` for brand flavor. Tinted fills append
`1A` hex alpha, e.g. `` `${colors.success}1A` `` for a 10% success wash.

## Typography (`typography.ts`)

Full scale (base, no scaling). Use `scaled(role, fontScale)` for dynamic type.

| Role | Size/Line | Weight | Use |
| ---- | --------- | ------ | --- |
| `display`    | 40/46  | 800 | Hero numbers |
| `displaySm`  | 34/40  | 800 | Section numerals |
| `headline`   | 28/34  | 800 | Page titles |
| `headlineSm` | 24/30  | 800 | Screen titles |
| `title`      | 20/26  | 700 | Card titles |
| `sectionTitle` | 17/22 | 700 | Section headers |
| `subtitle`   | 17/23  | 600 | Subheaders |
| `body`       | 15/22  | 400 | Body copy |
| `bodyStrong` | 15/22  | 600 | Emphasized body |
| `bodySm` / `bodySmStrong` | 13/19 | 400/600 | Meta |
| `caption`    | 12/16  | 500 | Labels |
| `overline`   | 11/14  | 700 | Uppercase eyebrow |
| `button`     | 15/20  | 700 | Button text |
| `label`      | 13/18  | 600 | Input labels |
| `metric`     | 30/34  | 800 | KPIs |
| `metricSm`   | 22/26  | 800 | Compact KPIs |

## Spacing (`spacing.ts`)

4px grid: `xxs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 3xl 32 · 4xl 40 ·
5xl 48 · 6xl 56 · 7xl 64`.

Layout: `gutter 20 · gutterSm 16 · section 24 · cardGap 12 · gridGap 10`.

## Radius (`radius.ts`)

`xs 6 · sm 10 · md 14 · lg 18 · xl 24 · 2xl 32 · full 9999`.

Cards = `lg`, buttons/inputs = `md`, avatars/pills = `full`.

## Elevation (`elevation.ts`)

`none · flat · raised · overlay`. Use `coloredShadow(color)` sparingly for brand glow.

## Opacity (`opacity.ts`)

`pressed 0.92 · disabled 0.38 · subtle 0.08 · faded 0.5`.

## Motion (`motion.ts`)

`durationFast 120 · durationBase 200 · durationSlow 260`. Easing: `out-cubic`
(preferred). Always < 250ms; never bounce except the press-spring.

## Icons (`icons.ts`)

Ionicons set (`@expo/vector-icons`). Size guide: icon 18–20 in buttons, 20–22 in
list cells, 24–26 in FAB, 28+ for empty states.

## zIndex (`zIndex.ts`)

`header 40 · sticky 50 · fab 60 · sheet 100 · toast 200`.

## Breakpoints (`breakpoints.ts`)

`sm 640 · md 768 · lg 1024`. Phone apps default to the compact scale.
