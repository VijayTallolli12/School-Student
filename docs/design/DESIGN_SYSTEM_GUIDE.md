# Design System Guide — Student App (Phase 6)

A premium, reusable design system for the Student App and the reference system for
the Teacher, Parent, and Driver apps. Everything here is token-driven, theme-aware
(light/dark), and built for Gen Z / Gen Alpha energy while staying professional.

## Source of truth

```
src/design-system/
├── index.ts           → token barrel (re-exported as "@design-system")
├── colors.ts          → Iris/Mint/Sunset/Basalt palette + semantic colors
├── typography.ts      → full type scale + scaled() dynamic type helper
├── spacing.ts         → 4px base grid + layout gutters
├── radius.ts          → friendly rounded corners
├── elevation.ts       → iOS/Android shadow tokens
├── opacity.ts         → interactive opacity presets
├── icons.ts           → icon set registry (Ionicons)
├── motion.ts          → <250ms motion durations/easings
├── zIndex.ts          → stacking order
├── breakpoints.ts     → responsive breakpoints
├── safeArea.ts        → safe-area insets usage
├── theme.ts           → createTheme(), lightTheme, darkTheme, useTheme()
└── components/
    ├── index.ts       → component barrel ("@design-system/components")
    ├── Text.tsx       → DesignText
    ├── Motion.tsx     → PressableScale, FadeInView
    ├── Button.tsx     → Button (primary/secondary/outlined/ghost × sm/md/lg)
    ├── Card.tsx       → Card (elevated/outlined/subtle/sunken)
    ├── Chip.tsx, Badge.tsx, Avatar.tsx, SectionHeader.tsx, Screen.tsx
    ├── SearchBar.tsx, EmptyState.tsx, Skeleton.tsx, ErrorState.tsx
    ├── Modal.tsx (BottomSheet), Toast.tsx
    └── Feature: HeroCard, StatCard, Progress, AttendanceCard, HomeworkCard,
        ExamCard, FeeCard, NotificationCard, CalendarCard, TransportCard,
        FloatingActionButton
```

## Rules (non-negotiable)

1. **Never hardcode colors/spacing/type in screens.** Use `useTheme()` + tokens.
2. **Motion is always < 250 ms.** See `motion.ts` tokens.
3. **Contrast:** body text on brand surfaces must be white (`#FFFFFF`); on cards use
   semantic text roles (text, textSecondary, textMuted, textTertiary).
4. **Touch targets ≥ 44 pt** for interactive elements (Buttons, nav, chips use hitSlop).
5. **Accessibility:** always set `accessibilityRole`, `accessibilityLabel`,
   `accessibilityState` on interactive controls (see Accessibility section).
6. **Dynamic type:** prefer `typeScale` + `scaled(role, fontScale)` and never disable
   font scaling (`allowFontScaling` stays true).
7. **Import from barrels**, not deep paths: `@/design-system` and
   `@/design-system/components`.
8. **Dark mode is automatic** via `useColorScheme()`; do not gate it manually.

## How to use

### 1. Theme hook

```tsx
import { useTheme } from "@/design-system/theme";

const { colors } = useTheme();
// colors.brand, colors.card, colors.text, colors.success, colors.warning,
// colors.error, colors.info, colors.secondary, colors.accent, colors.divider ...
```

### 2. Screen scaffolding

```tsx
import { AppContainer, AppHeader } from "@/design-system/components";
import { router } from "expo-router";

export default function Screen() {
  return (
    <AppContainer>
      <AppHeader title="My Screen" showBack onBack={() => router.back()} />
      {/* content */}
    </AppContainer>
  );
}
```

### 3. Buttons / Cards / Chips

```tsx
<Button title="Submit" icon="send" onPress={handle} loading={busy} />
<Card variant="elevated" padding="md" onPress={go}>…</Card>
<Chip label="Homework" selected onPress={filter} />
```

### 4. Feature blocks

```tsx
<HeroCard greeting="Good morning" dateLine="Thursday, 6 August" studentName="Aarav"
  classLine="Class 7 · Section A · Roll 12" avatarUri={photo} schoolName="Green Valley" />
<StatCard label="Attendance" value="92%" icon="calendar-outline" color={colors.success} />
<AttendanceCard snapshot={attendanceSnapshot} />
<FeeSummaryCard fee={fee} />
```

## Theming with school branding

`useTheme()` merges the runtime school branding store (`@/store/branding.store`) with
the system color scheme. When a school sets a `primaryColor`, the brand surface,
buttons, active tab pill, chips, and focus rings all adopt it automatically — no
screen changes needed.

## Legacy Tailwind classes

Existing screens still use NativeWind classes. `tailwind.config.js` provides forward
compatible aliases:

- `primary-*` → Iris brand scale (replaces old blue `primary` scale)
- `status.success|warning|error|info` → semantic scales
- `brand`, `secondary`, `accent`, `surface-*`, `text-*`, `basalt` scales

New screens should migrate to the token API (`useTheme`) over time.

## Accessibility quick checklist

| Element            | Required props                                   |
| ------------------ | ------------------------------------------------ |
| Button/Chip/Icon   | `accessibilityRole="button"`, label, state       |
| Tab bar            | `accessibilityRole="tab"`, `accessibilityState`  |
| Screen header      | `accessibilityRole="header"` on title Text       |
| Form input         | `accessibilityRole="search"/"text"`, label       |
| Toast/errors       | `accessibilityRole="alert"`                      |
| Decorative avatar  | `accessible={false}`                             |

## Performance

- All primitives and feature components are `memo`ized.
- Animations run on the native driver (opacity/transform only).
- Lists should use `FlatList`/`FlashList` with stable keys; the component library is
  designed to be render-light.
- Staggered `FadeInView` uses a 45ms cascade — never exceed ~6 items to avoid jank.

See `COMPONENT_LIBRARY.md`, `DESIGN_TOKENS.md`, `DASHBOARD_UX.md`, `FIGMA_SPEC.md`,
and the color/typography/icon/motion guides in this folder for deeper specs.
