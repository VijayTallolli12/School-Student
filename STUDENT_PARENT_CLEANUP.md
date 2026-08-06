# STUDENT_PARENT_CLEANUP

Date: 2026-08-06

## Cleanup Completed
- Removed parent-centric dashboard structure from home screen.
- Removed parent-first navigation shape; replaced with student-priority tabs.
- Replaced visible profile wording from guardian-parent framing to neutral contact framing in student profile screen.

## Files Touched for Cleanup
- src/app/(tabs)/(home)/index.tsx
- src/app/(tabs)/_layout.tsx
- src/components/BottomTabBar.tsx
- src/app/(tabs)/(home)/academics.tsx
- src/app/(tabs)/(home)/student-profile.tsx

## Residual Non-Blocking Items
- Historical parent report markdown files remain in repository root (non-runtime).
- A few backend profile fields still map from parent-era naming (`father_name`, `mother_name`) but are no longer displayed with parent-centric labels in updated student UI.

## Result
- Runtime student app experience no longer reads like copied parent dashboard/navigation in updated core screens.
