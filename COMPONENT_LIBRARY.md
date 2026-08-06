# Component Library — Design System

Every component in `src/design-system/components/`. Import via the barrel:

```tsx
import { Button, Card, Chip, Avatar, ProgressRing } from "@/design-system/components";
```

## Primitives

### DesignText
`<DesignText role="title" color="text">` — token text with a full role scale
(`display` → `label`, `metric`, `sectionTitle`). Respects dynamic type via `scaled()`.

### Button
| Variant    | Usage                          |
| ---------- | ------------------------------ |
| `primary`  | Main CTA (brand surface)       |
| `secondary`| Brand-deep emphasis            |
| `outlined` | Secondary actions              |
| `ghost`    | Tertiary/inline actions        |

Sizes `sm` (40), `md` (48), `lg` (54). Props: `icon`, `iconPosition`, `loading`,
`disabled`, `fullWidth`. Loading shows a spinner and disables. Full a11y wired.

### Card
Variants: `elevated` (default, subtle shadow), `outlined` (hairline border),
`subtle` (tinted), `sunken` (recessed). Padding scale `none|sm|md|lg`.
`onPress` upgrades to a tactile `PressableScale`.

### Chip
Filter pill. `selected` toggles brand fill. Pressable when `onPress` supplied.
Touch target padded via hitSlop.

### Badge & Tag
- `Badge` — compact count (unread indicators). `tone`, `max` (default 99).
- `Tag` — inline status label (`brand|success|warning|error|info|neutral`).

### Avatar
Sizes `xs`→`hero`. Image-first with initials fallback. `ring` adds a premium border.
Container is `accessible={false}` (decorative).

### SectionHeader
`title` + optional `subtitle` + trailing `actionLabel`/`onAction` link.

### Screen
- `AppContainer` — themed background + safe area + optional ScrollView.
  `fullBleed` removes the horizontal gutter for edge-to-edge heroes.
- `AppHeader` — back button, title/subtitle, optional right slot. 44pt targets.

### SearchBar
Themed search field with focus ring, clear button, `accessibilityRole="search"`.

### EmptyState
Icon + title + description + optional `actionLabel`/`onAction`. Used for no-data.

### Skeleton
`Skeleton` (shimmer block), `CardSkeleton`, `LoadingSkeleton` (full-screen pattern).

### ErrorState / RetryView
Error icon + message + Retry. `RetryView` is the compact inline version.

### BottomSheet (Modal)
Drag-to-dismiss bottom sheet via PanResponder + backdrop. Token radius/elevation.

### ToastProvider / useToast
Global toast: `useToast().showToast("Saved", { tone: "success" })`. Wrap app root in
`<ToastProvider>`.

## Motion

### PressableScale
Gentle 0.97 scale-in on press, spring back. `noScale` to disable.

### FadeInView
Fade + 8px rise on mount, optional `index` for a 45ms stagger cascade.

## Feature components (dashboard & modules)

| Component         | Props / Data                         | Best for                     |
| ----------------- | ------------------------------------ | ---------------------------- |
| HeroCard          | greeting, dateLine, studentName, avatarUri, schoolLogo/Name, streak | Dashboard hero |
| StatCard          | label, value, icon, color, delta     | KPI tiles                    |
| ProgressRing      | value 0..1, size, color, label       | % rings (fees, attendance)   |
| ProgressBar       | value 0..1, color                    | linear progress              |
| AttendanceCard    | `AttendanceSnapshot`                 | attendance summary card      |
| HomeworkCard      | `HomeworkItem`                       | homework list item           |
| ExamResultCard / ExamSection | `ExamResultRecord`          | results grouped              |
| FeeSummaryCard / FeeItemCard | `StudentFee`, `FeeItem`      | fees overview + items        |
| NotificationCard  | `NotificationItem`                   | notification list item       |
| CircularCard      | `CircularItem`                       | circular list item           |
| CalendarEventCard | `CalendarEvent`                      | calendar/academic events     |
| AchievementCard   | `AchievementItem`                    | streaks/badges               |
| TransportCard     | `TransportSnapshot`                  | bus route status             |
| FloatingActionButton | icon, label                       | floating action              |

## Usage example — dashboard row

```tsx
<View style={{ flexDirection: "row", gap: spacing.md }}>
  <StatCard label="Attendance" value="92%" icon="calendar-outline" color={colors.success} />
  <StatCard label="Fee pending" value="₹2.4K" icon="wallet-outline" color={colors.error} />
</View>
```

## Component contract

- All components accept optional `style` (merges, never overrides tokens).
- All interactive components expose `accessibilityRole`, `Label`, and `State`.
- Colors only come from `useTheme().colors`; never literals.
- Motion only via `PressableScale`/`FadeInView` or tokens from `motion.ts`.
