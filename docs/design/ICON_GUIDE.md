# Icon Guide

Icons use **Ionicons** (`@expo/vector-icons`) — consistent, free, vector, themable.

## Size conventions

| Context                 | Size |
| ----------------------- | ---- |
| Button icon             | 18–20 |
| List-cell leading icon  | 20–22 |
| Tab bar                 | 22   |
| FloatingActionButton    | 26   |
| Empty-state hero        | 28+  |
| Notification type dot   | —    |

## Color conventions

- Icon color = its meaning token (see Color Guide).
- Icon background wash: `${token}1A` rounded container.
- Never color icons with raw grays when a semantic token applies.

## Module → icon map

| Module           | Icon (outline)      |
| ---------------- | ------------------- |
| Homework         | `book-outline`      |
| Timetable        | `time-outline`      |
| Attendance       | `calendar-outline`  |
| Exams            | `ribbon-outline` / `create-outline` |
| Results          | `trophy-outline`    |
| Fees             | `wallet-outline`    |
| Circulars        | `megaphone-outline` |
| Documents        | `folder-open-outline` |
| Leave            | `paper-plane-outline` |
| Transport        | `bus`               |
| Notifications    | `notifications-outline` |

## Status icons (attendance)

`present` → `checkmark-circle`, `absent` → `close-circle`, `late` → `time`,
`half_day` → `remove-circle`. Colored by semantic token.

## Rules

- Filled glyph for the active/focused state, outline for default.
- Decorative icons: mark the parent `accessible={false}` so screen readers skip them.
- Register any new icon usage in `icons.ts` for the central inventory.