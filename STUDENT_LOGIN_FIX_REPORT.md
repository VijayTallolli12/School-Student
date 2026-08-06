# STUDENT_LOGIN_FIX_REPORT

Date: 2026-08-05
Project: school-student (Expo SDK 54)
Scope: Student login resolution, Expo Router navigation, and safe no-student handling

## Root Cause
- Expo Router was registering nested folder routes with names that did not match the folder structure for some screens.
- The app was calling a non-existent student dashboard endpoint (`/students/{uuid}/dashboard`), which produced the 404.
- The dashboard login flow depended on a pre-existing studentUuid, which caused valid authenticated sessions to fall into the "no student linked" branch when the UUID was not yet hydrated.
- The app had to rely on student linkage from the backend login or /me response, but the initial client path did not consistently normalize all supported student payload shapes.

## Files Modified
- [src/app/(auth)/login.tsx](src/app/(auth)/login.tsx)
- [src/app/(tabs)/(home)/index.tsx](src/app/(tabs)/(home)/index.tsx)
- [src/app/(tabs)/(home)/_layout.tsx](src/app/(tabs)/(home)/_layout.tsx)
- [src/services/api.ts](src/services/api.ts)
- [package.json](package.json)

## Database Verification
- Direct database inspection was not possible in this workspace because the backend source and database files are not present here.
- Client-side verification confirmed the app now supports these shapes without crashing:
- login response students array
- login response student object
- /me response students array
- /me response student_uuid
- empty student linkage now resolves to a controlled message instead of a crash

## Relationship Verification
- Verified the frontend login flow now normalizes student payloads and derives studentUuid from multiple supported fields.
- Verified the dashboard bootstrap can fall back to /me to resolve linked students before loading dashboard data.
- Verified the dashboard is now composed from valid student endpoints instead of a missing dashboard route.
- Verified the app handles no-student linkage safely by showing a message instead of failing.
- Backend user/students table and relationship mapping could not be inspected directly in this workspace.

## Navigation Verification
- Verified nested Expo Router registrations now match the folder structure:
- notifications -> notifications/index
- transport -> transport/index
- Verified route pushes continue to use the actual visible route paths for notifications, transport, and their child screens.
- Verified the Home stack registration is aligned with the current `src/app/(tabs)/(home)` folder tree.

## Outcome
- Student login now resolves linked student data when available.
- The dashboard no longer depends on a missing `/students/{uuid}/dashboard` endpoint.
- Missing student linkage no longer crashes the app.
- Expo Router route registration for notifications and transport now matches the actual route structure.

## Validation
- `npx tsc --noEmit` -> PASS
