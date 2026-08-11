# Dashboard UX — Design Principles

Guidance for the redesigned dashboard and similar "today" surfaces.

## Layout flow (top → bottom)

1. **HeroCard** — brand gradient surface. Greeting + date, ringed student avatar,
   streak chip, school badge, motivational line. This is the emotional anchor.
2. **At a glance** — 3 `StatCard` KPIs (attendance %, fee pending, overall grade).
   Numbers first, labels subtle.
3. **Quick actions** — 2×2 tactile `QuickActionButton` grid (Homework, Attendance,
   Exams, Fees). Action-first energy.
4. **Attendance** — `AttendanceCard` progress snapshot.
5. **Recent updates** — top 3 `NotificationCard`s with unread dots; "View all".

## Principles

- **Friction to answer:** the top 3 questions (attendance %, fees due, next grade)
  must be answerable without scrolling.
- **Action-first:** always surface the 2–4 most-used actions prominently, not a wall
  of 8 modules. Secondary modules live behind "All modules".
- **Numbers breathe:** KPIs use `metric`/`metricSm` with tight tracking and strong
  weight; labels use muted small text.
- **Brand energy, restrained:** one hero + accent-colored icon chips. Avoid rainbow
  palettes — use semantic color only for meaning.
- **Empty/loading/error parity:** every state looks intentional (Skeleton, EmptyState,
  ErrorState — not raw spinners).
- **Motion:** `FadeInView` stagger at 45ms, max 6 items, native driver only.

## Color usage on the dashboard

| Meaning        | Token                            |
| -------------- | -------------------------------- |
| Good (≥75%)    | `success`                        |
| Needs attention | `warning` / `error`             |
| Brand CTA      | `brand`                          |
| Info / homework| `info`                           |

Tinted icon chips: `${token}1A` background with the solid token icon.

## Writing

- Greeting uses time-of-day (Good morning/afternoon/evening) + first name.
- Motivational line is a single, current, believable sentence — never generic
  slogans repeated on every visit.
- Numbers use Indian currency compact format (`₹2.4K`, `₹1.2L`).

## Anti-patterns

- Hardcoded hex colors in screens (always `useTheme`).
- More than ~6 FadeInView items (jank).
- Full-screen surprise animations on every load.
- Dense walls of equal-weight text — hierarchy via type roles.