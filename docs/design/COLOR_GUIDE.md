# Color Guide

System: `useTheme().colors`. Never hardcode hex in Product components.

## Brand trio

- **Iris** `#7C4DFF` — primary brand. CTAs, hero, active tab, focus, chips.
- **Mint** `#2DB392` — secondary brand. Positive secondary actions, encouragement.
- **Sunset** `#FB5E1D` — accent, used sparingly for flair/energy.

## Semantic

| Token     | Value      | Means                                          |
| --------- | ---------- | ---------------------------------------------- |
| `success` | `#10B981`  | Paid, present, single-digit score, approved    |
| `warning` | `#F59E0B`  | Partial, due soon, pending                     |
| `error`   | `#EF3D5B`  | Absent, unpaid, overdue, rejected              |
| `info`    | `#06B6D4`  | Homework, neutral informational                |

## Neutrals (Basalt)

Violet-tinted neutrals give the brand a cooler, more premium feel than pure grey:

- Background `#F7F6FC`, Card `#FFFFFF`, Subtle `#F0EEF7`, Sunken `#E9E7F5`.
- Text `#1B1830` → `textSecondary #5C5B78` → `textMuted #A5A2BC` → `textTertiary #9E9BB8` → `textDisabled #CDCBE0`.

## Tinted fills

Append a 2-digit hex alpha for a 10–15% wash:
`${colors.success}1A` (10%), `${colors.success}26` (15%).

## Contrast rules

- Body/strong text on cards → `text` / `textSecondary` (≥ 4.5:1).
- Text on brand surfaces → `onBrand` (`#FFFFFF`).
- Dashes/meta → `textMuted`/`textTertiary` never below `#9E9BB8`.
- Disabled interactive → `opacity` token, not a text-color change alone.

## Color-blind note

Semantic pairs rely on hue + lightness, not hue alone (e.g. absent is both red AND
darker than present-green). Always pair colour with an icon/server state label.