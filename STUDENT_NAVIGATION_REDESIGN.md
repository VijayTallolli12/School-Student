# STUDENT_NAVIGATION_REDESIGN

Date: 2026-08-06

## New Bottom Navigation
- Home
- Academics
- Fees
- Alerts (Notifications)
- Profile

## Updated Files
- src/app/(tabs)/_layout.tsx
- src/components/BottomTabBar.tsx
- src/app/(tabs)/(home)/_layout.tsx
- src/app/(tabs)/(home)/academics.tsx

## Why This Helps Students
- Frequent student actions are top-level and always reachable.
- Learning modules are grouped under Academics for predictable navigation.
- Fee and alert visibility is no longer buried in deep stacks.

## Hierarchy Simplification
- Removed overreliance on single-home-screen entry into all modules.
- Created a dedicated Academics hub to reduce route hunting.
- Standardized tab labels to student-understandable vocabulary.

## Remaining IA Option
- If product requires explicit overflow semantics, Academics can be renamed to More while preserving current route architecture.
