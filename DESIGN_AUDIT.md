# DESIGN_AUDIT — Student App (Current UI)

Audited every screen and shared component. Scoring is relative to a
**premium consumer app** standard (Duolingo, Spotify, Apple Fitness, Notion),
not relative to ERP software.

Overall verdict: **Functional but generic ERP-style UI.** The app works, but it
looks like an admin dashboard wearing a fresh coat of paint. Hardcoded colors,
no token system, no motion, no hierarchy, no personality.

---

## Category Scores

### Colors — 4 / 10
- Brand blue `#2563EB` (tailwind `primary-500`) is a textbook ERP blue.
- Hardcoded hex everywhere: `#3B82F6`, `#06B6D4`, `#64748B`, `#475569`,
  `#94A3B8`, `#CBD5E1`, `#F59E0B`, `#DC2626`, `#0D9488`, `#EC4899`…
  (e.g. dashboard index, academics, transport, attendance, leave, fees).
- No semantic token layer (`background`, `surface`, `border`, `divider`,
  `text-secondary`, `text-disabled`).
- No dark theme. No color-blind-safe pairs. No vibrant secondary/accent.
- Positive: neutral slate base is clean, and `surface-*`/`status-*` groups exist
  as a starting point.

### Spacing — 3 / 10
- Ad-hoc values: `px-3.5`, `py-3.5`, `pt-4`, `gap-2.5`, `w-[48%]`, `w-[32%]`.
- No 4px-base spacing scale is consistently applied; padding rhythm differs per
  screen (headers `pt-3 pb-3`, content `pt-4`, `pt-5`).
- `src/theme/index.ts` defines a spacing scale but screens never consume it.

### Typography — 4 / 10
- Single system font, no font scaling strategy for accessibility.
- Limited scale (`h1…h4`, `body`, `caption`, `metric`) — no `display`,
  `overline`, `button`, `label` roles.
- Letter-spacing/tracking used inconsistently (`tracking-tight`, `tracking-wide`,
  `tracking-wider` sprinkled ad hoc).
- Hardcoded sizes everywhere: `text-[11px]`, `text-[13px]`, `text-[24px]`.

### Cards — 5 / 10
- Consistent `bg-white rounded-2xl border-slate-100` — a good base.
- Shadow hardcoded inline in `Card.tsx` and repeated in screens.
- No `subtle`/`elevated`/`outlined`/`sunken` variants; no press feedback beyond
  `activeOpacity`.
- No gradient/hero card, no emphasis card, no achievement-style cards.

### Buttons — 5 / 10
- Four variants (primary/secondary/outline/ghost) and three sizes — solid API.
- But color comes from branding store only for primary/secondary; outline & ghost
  hardcode slate.
- No icon support, no press-scale animation, no accessible min height
  (`py-2.5` ≈ 42px is borderline).
- Variants are not tokenized (`variantStyles` are empty strings filled inline).

### Inputs — 6 / 10
- `Input.tsx` is the best component: memoized, focus ring, error state, password
  toggle, left icon.
- Still uses hardcoded hex for focus/error/border colors.

### Lists — 4 / 10
- Every list is `ScrollView` + `.map()` with inline JSX — no `FlashList`, no
  shared list item components, repeated card markup across screens.

### Icons — 6 / 10
- Consistent `Ionicons` everywhere (good).
- Mixed sizes and colors inline (`18`, `20`, `22`, `24`, `28`, `32`) with no
  size token or icon-color token; filled vs outline mixed ad hoc.

### Navigation — 5 / 10
- Custom `BottomTabBar` works and shows focus state, but is plain: no icons in a
  contained pill, no badge, no press animation, hardcoded `#E2E8F0`/`#94A3B8`.
- Headers are hand-rolled per screen (back button + title) with slightly
  inconsistent padding.

### Badges — 6 / 10
- `Badge.tsx` is fine but only 5 variants and no dot/count styles; uses tailwind
  green/amber/red rather than semantic tokens.

### Avatars — 4 / 10
- Initials-only circles; student photo exists in API (`photo`) but is not used
  in the dashboard hero; no online/presence styling.

### Illustrations — 2 / 10
- None. No empty-state art, no hero illustration, no mascot/energy. Everything is
  icon-on-tinted-circle.

### Shadows — 4 / 10
- Hardcoded inline shadow objects (Card, Button, dashboard), three scales in
  `src/theme/index.ts` that screens never use.

### Animations — 3 / 10
- Only the splash screen animates. No press feedback, no screen transitions, no
  skeleton shimmer, no pull-to-refresh polish, no streak/success celebration.

### Loading — 5 / 10
- `ActivityIndicator` + text on most screens; one basic `Skeleton`/`CardSkeleton`.
- No shimmer, no staggered skeletons, inconsistent placement.

### Empty States — 5 / 10
- `EmptyState` is functional (icon, title, description, action) but plain.

### Error States — 5 / 10
- `ErrorState`/`OfflineState` functional; wording is technical, not friendly.

### Accessibility — 3 / 10
- No dark mode. No `maxFontSizeMultiplier`/scaled tokens. Several touch targets
  below 44px (`w-8 h-8` headers, `py-2.5` buttons). Color-only status cues
  (badge text colors) without icon redundancy. No high-contrast pass.

### Performance — 5 / 10
- `Input` is memoized; most other components re-render without memo.
- No `FlashList`. Images only via branding logo.

---

## Priority Fixes (design system first)

1. Build a token layer (`src/design-system/`) — colors, type, spacing, radius,
   elevation, opacity, motion, z-index, breakpoints, safe area.
2. Extend NativeWind theme so tokens map to utilities.
3. Rebuild shared components on tokens (buttons, cards, headers, badges, avatars,
   empty/error/loading, toast, sheet).
4. Add motion primitives (press scale, fade, stagger) < 250ms.
5. Redesign the Dashboard as an action-first hero experience.
6. Apply the system to key screens (Academics, Attendance, Fees, Login).
7. Accessibility: dark mode, dynamic type, 44px targets, a11y labels.
8. Performance: memo components, use `FlashList` where lists grow.
