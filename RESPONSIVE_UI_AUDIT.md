# RESPONSIVE_UI_AUDIT

Date: 2026-08-06
Project: school-student (Expo SDK 54, RN 0.81, Fabric)
Method: Static source analysis (TypeScript + NativeWind inspection). Device/screenshot verification is a follow-up requirement (see DEVICE_COMPATIBILITY_REPORT.md).

## Scope
Every screen under `src/app/**/*.tsx` plus the design-system primitives that every screen depends on (`src/design-system/components/*`, `src/components/*`).

## Findings by Category

### 1. Cropped Text (numberOfLines={1} on user data)
| File | Line | Content | Severity |
|------|------|---------|----------|
| exam-schedule.tsx | 94 | `exam.exam_name` truncated to 1 line | High — FIXED |
| documents.tsx | 130 | `doc.title` truncated to 1 line | High — FIXED |
| fees.tsx | 238 | fee category in fee-items list | High — FIXED |
| fees.tsx | 303 | fee category in paid-history list | High — FIXED |
| leave.tsx | 157 | leave-type title | Medium — FIXED |
| leave.tsx | 178 | leave `reason` (user content) | High — FIXED |
| homework.tsx | 129 | static "View Attachment" label | Low — acceptable |

All important user content now wraps to 2 lines instead of clipping.

### 2. Overflow / Fixed Width Components
| File | Line | Value | Verdict |
|------|------|-------|---------|
| HeroCard.tsx | 48 | `minHeight: 150` | Removed — height now content-driven |
| HeroCard.tsx | 94/131 | `numberOfLines={1}` on name/class | Now 2-line wrap + `adjustsFontSizeToFit` |
| AttendanceCard.tsx | 61 | `width: 110` progress column | Replaced with `width:26% / min 72 / max 120` |
| Modal.tsx | 19 | `SHEET_HEIGHT = window*0.6` | Now computed per render + capped 520 + bottom inset |
| CalendarCard.tsx | 115 | `AchievementCard width:110` | Intentional fixed-width tile (horizontal strip) — OK |
| login.tsx | 184-206 | logo/avatar 48–64pt boxes | Decorative/fixed identity — OK |

Icon boxes (28–44pt) across cards are fixed by design and do not cause overflow.

### 3. Broken Flex Layouts / Crammed Rows
| File | Line | Issue | Verdict |
|------|------|-------|---------|
| (home)/index.tsx | 388 | 3 StatCards `flex:1` | Now adaptive `Grid` (2 cols small, 3 cols ≥400pt) |
| (home)/index.tsx | 417 | Quick actions 2×2 rows | Now `Grid` (2 cols phone, 4 cols tablet) |
| attendance.tsx | 189 | 3 StatCards `flex:1` | Now adaptive `Grid` |
| leave.tsx | 118 | 3 summary cards | Now adaptive `Grid` |
| attendance.tsx | 279-323 | 7-col calendar grid (`14.28%`) | Intentional calendar layout; cells ≈36pt on 320pt — acceptable |

### 4. Wrong Padding / Margins
- No systemic issues found. All screens use `spacing` tokens or NativeWind scale (`px-5`, `py-3.5`). Consistent 20pt gutters via `AppContainer`.

### 5. Small Touch Targets (< 44pt)
| File | Line | Control | Fix |
|------|------|---------|-----|
| assignments.tsx | 73 | 32pt back button | `hitSlop={10}` |
| leave.tsx | 74 | 32pt back button | `hitSlop={10}` |
| leave/[id].tsx | 70, 91 | 32pt back buttons | `hitSlop={10}` |
| leave/apply.tsx | 116 | 32pt back button | `hitSlop={10}` |
| student-profile.tsx | 38, 70 | 32pt back buttons | `hitSlop={10}` |
| transport/driver.tsx | 55 | 32pt back button | `hitSlop={10}` |
| attendance.tsx | 260-273 | 36pt month arrows | `hitSlop={6}` |
| calendar.tsx | 107-123 | 36pt month arrows | `hitSlop={6}` |
| attendance.tsx | 295 | day cells ≈36pt | Calendar density trade-off — acceptable |
| Button sm | Button.tsx:31 | height 40 | Bumped to 44 |

Design-system primitives already comply: `AppHeader` back (44), `BottomTabBar` tabs (48 min), `SearchBar` (48), `Button md/lg` (48/54), `QuickActionButton` (92 min), `Chip` (34 + hitSlop 6 → 46 effective).

### 6. Layout Shift
- Dashboard: adaptive `Grid` computes cell width from its own `onLayout` before first paint — items use a percentage fallback so there is no jump.
- `AppContainer` now caps content width on tablets (`maxWidth: 720`, centered) — only activates ≥640pt, so phone layouts are unchanged.

### 7. Unsafe Areas
| File | Issue | Fix |
|------|-------|-----|
| app/index.tsx (Splash) | Plain `View` under status bar | Wrapped in `SafeAreaView` (all edges) |
| Modal.tsx | Sheet bottom padding fixed 24 | Now `max(insets.bottom, 24)` |
| All data screens | N/A | Already via `AppContainer` → `SafeAreaView` edges top/left/right |
| BottomTabBar | N/A | Already `paddingBottom: max(insets.bottom, xs)` |
| login.tsx | N/A | Own `SafeAreaView` |

### 8. Fixed Heights
| File | Line | Value | Verdict |
|------|------|-------|---------|
| HeroCard.tsx | 48 | minHeight 150 | Removed |
| BottomTabBar.tsx | 38 | 62 row | Fixed chrome — OK |
| StatCard value | 78-85 | — | Uses `adjustsFontSizeToFit` |
| login.tsx | — | 48–64 identity boxes | Intentional |

## Clean Screens
`profile/index.tsx`, `edit-profile.tsx`, `change-password.tsx`, `settings.tsx`, `privacy.tsx`, `help.tsx`, `academics.tsx`, `homework.tsx`, `results.tsx`, `timetable.tsx`, `notifications/*`, `circulars/*`, `documents.tsx` (post-fix), `transport/*` (post-fix), `student-profile.tsx` (post-fix) — no responsive violations detected.

## Overall
- All High-severity findings resolved.
- Remaining items are intentional design choices (calendar density, fixed identity/icon boxes, fixed chrome) — documented, not defects.
- Certification status: see LAYOUT_CERTIFICATION.md.
