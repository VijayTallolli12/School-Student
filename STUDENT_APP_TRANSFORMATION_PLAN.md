# STUDENT APP TRANSFORMATION PLAN

## Purpose

Transform the existing Parent App copy into a production-ready Student App while preserving the current architecture, design system, performance optimizations, offline handling, branding, security, and coding standards.

This is a transformation project, not a rewrite.

## Current Project Summary

- Project is currently named `school-parent` in `package.json` and `app.json`.
- It uses Expo Router, Expo SDK 54, React Native 0.81.5, Zustand, axios, nativewind, React Hook Form, React Query, and Zod.
- App already contains a complete Parent App experience with dashboard, attendance, homework, timetable, calendar, results, fees, documents, notifications, transport, leave requests, and profile flows.
- The architecture is already modular and reusable, with clear separation for services, stores, UI components, and screen routes.

## Reusable Layers

### Reusable UI / UX
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Loading.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/ErrorState.tsx`
- `src/components/ui/OfflineState.tsx`
- `src/components/ScreenWrapper.tsx`
- `src/components/BottomTabBar.tsx`

### Reusable Services
- `src/services/api.ts`
  - axios client with base URL, timeout, headers
  - request interceptor for auth token injection
  - response interceptor for logging and 401 logout
  - shared error helpers: `isNetworkError`, `isTimeoutError`, `getErrorMessage`
  - API helpers for dashboard, attendance, fees, exams, timetable, notifications, documents, homework, circulars, transport, and profile
- `src/services/branding.ts`
  - Branding fetch, caching, refresh, normalization, theme build

### Reusable Stores
- `src/store/auth.store.ts`
  - persistent auth store via Zustand and AsyncStorage
  - common login/logout/hydration/token state
- `src/store/branding.store.ts`
  - persistent branding store and theme management

### Reusable App Shell
- `src/app/_layout.tsx`
- `src/app/index.tsx` (splash + auth redirect)
- `src/app/(auth)/_layout.tsx`
- `src/app/(tabs)/_layout.tsx`
- `src/app/(tabs)/(home)/_layout.tsx`

### Reusable Offline / Error Patterns
- Screens already use `OfflineState`, `EmptyState`, `ActivityIndicator`, and `RefreshControl`.
- `src/components/ui/OfflineState.tsx` and `src/components/ui/EmptyState.tsx` are reusable and should be preserved.

### Reusable Branding
- `src/constants/branding.ts`
- `src/types/branding.ts`
- `src/store/branding.store.ts`
- `src/services/branding.ts`
- Runtime branding is already loaded in `src/app/_layout.tsx` and refreshed in login.

## Parent-Specific Modules / Patterns

### Parent-specific route concepts
- `parentUuid` is used everywhere in API calls and auth store
- `students` list plus `selectedStudentUuid` and the `ChildSwitcher` component
- Parent navigation is currently built around selecting a child and viewing child data

### Parent-only screens
- `src/app/(tabs)/(home)/leave.tsx`
- `src/app/(tabs)/(home)/leave/apply.tsx`
- `src/app/(tabs)/(home)/leave/[id].tsx`
- `src/app/(tabs)/(home)/student-profile.tsx`
- The `ChildSwitcher` UX is parent-specific and should be removed or significantly repurposed.

### Parent-specific API usage
- Current endpoints use `/parents/${parentUuid}/children/${childUuid}/...`
- Current auth login response includes `students` and `parent_uuid`
- Current profile screens show linked students and parent user details together

## Student-Specific Needs

### Student app modules present or easily reusable
- Dashboard -> Student dashboard
- Attendance -> My Attendance
- Homework -> My Homework
- Timetable -> My Timetable
- Calendar -> Student Calendar
- Results -> My Results
- Fees -> My Fees
- Documents -> My Documents
- Notifications -> My Notifications
- Profile -> My Profile
- Transport -> My Transport
- Circulars -> Announcements / Notices
- Settings / Help / Privacy -> Student settings flow

### Student app modules missing or incomplete
- `Library` (no current screen exists)
- `Exams` separate from `Results` (current `results.tsx` may cover exam result listing, but there is no explicit exams module screen)
- `About` screen / app info references if required by student release

### Authentication / authorization
- Replace parent login flow with student login flow while reusing the auth store, token storage, interceptors, and 401 handling.
- Student auth should no longer expose multi-child switching or `parentUuid`.
- Ensure token/session restore works offline with existing AsyncStorage-based persistence.

## Navigation Transformation

### Current navigation
- Bottom tabs: `(home)`, `profile`
- Home stack includes all content screens and parent-only routes

### Student navigation requirements
- Student bottom tabs should contain core modules: Dashboard, Attendance, Homework, Timetable, Calendar, Exams/Results, Fees, Library, Transport, Documents, Notifications, Profile/Settings, Logout.
- Existing `BottomTabBar.tsx` can be reused, but tab items must be updated.
- Existing top-level `profile` tab can remain for profile/settings flow.
- Home stack should remove parent-only home flows and add any required student-specific screens.

## API Transformation Requirements

### Reuse current API layer as much as possible
- Keep `apiClient`, interceptors, `unwrap`, error helpers, and storage integration.
- Preserve shared type definitions in `src/types/index.ts` where applicable.

### Candidate backend mapping changes
- Replace `/parents/{uuid}/dashboard` with a student-facing dashboard endpoint
- Replace `/parents/{uuid}/children/{childUuid}/attendance` with `/students/{uuid}/attendance` or `/me/attendance`
- Replace `/parents/{uuid}/children/{childUuid}/fees` with student fees endpoint
- Replace exams, timetable, homework, calendar, documents, transport endpoints accordingly
- Remove or repurpose leave-request endpoints
- Keep `/notifications`, `/notifications/unread`, `/notifications/{id}/read`, `/notifications/read-all` if common for student app
- Keep `/me` if it supports student user profile data

### Phase 5 deliverable
- Generate `STUDENT_API_MAPPING.md` after backend review to document Parent endpoint -> Student endpoint mappings.

## Branding and Identity

### Required application identity updates
- Rename application display name to `School Student`
- Rename package/slug from `school-parent` to `school-student`
- Update `package.json.name`
- Update `app.json.expo.name`, `slug`, `scheme`, and any metadata references
- Update splash text, about text, display name references
- Keep launcher icon asset references unchanged until later phase
- Preserve branding service and dynamic ERP branding integration

### Branding reuse
- Keep `useBrandingStore`, `brandingService`, `DEFAULT_BRANDING`, and theme build logic.
- Only update branding storage keys if required for app identity.

## File Inventory for Transformation

### Core files to review/transform
- `package.json`
- `app.json`
- `src/app/_layout.tsx`
- `src/app/index.tsx`
- `src/app/(auth)/login.tsx`
- `src/app/(tabs)/_layout.tsx`
- `src/app/(tabs)/(home)/_layout.tsx`
- `src/app/(tabs)/(home)/index.tsx`
- `src/app/(tabs)/(home)/attendance.tsx`
- `src/app/(tabs)/(home)/homework.tsx`
- `src/app/(tabs)/(home)/timetable.tsx`
- `src/app/(tabs)/(home)/calendar.tsx`
- `src/app/(tabs)/(home)/results.tsx`
- `src/app/(tabs)/(home)/fees.tsx`
- `src/app/(tabs)/(home)/documents.tsx`
- `src/app/(tabs)/(home)/transport/index.tsx`
- `src/app/(tabs)/(home)/transport/driver.tsx`
- `src/app/(tabs)/(home)/transport/route.tsx`
- `src/app/(tabs)/(home)/notifications/index.tsx`
- `src/app/(tabs)/(home)/notifications/[id].tsx`
- `src/app/(tabs)/profile/index.tsx`
- `src/app/(tabs)/profile/edit-profile.tsx`
- `src/app/(tabs)/profile/change-password.tsx`
- `src/app/(tabs)/profile/help.tsx`
- `src/app/(tabs)/profile/privacy.tsx`
- `src/app/(tabs)/(home)/circulars.tsx`
- `src/app/(tabs)/(home)/circulars/[id].tsx`
- `src/store/auth.store.ts`
- `src/services/api.ts`
- `src/services/branding.ts`
- `src/store/branding.store.ts`
- `src/constants/branding.ts`
- `src/components/BottomTabBar.tsx`
- `src/components/ChildSwitcher.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/OfflineState.tsx`

### Candidate removal or repurpose files
- `src/app/(tabs)/(home)/student-profile.tsx`
- `src/app/(tabs)/(home)/leave.tsx`
- `src/app/(tabs)/(home)/leave/apply.tsx`
- `src/app/(tabs)/(home)/leave/[id].tsx`

## Constraints and Non-Negotiables

- Do not recreate the project.
- Do not reinstall dependencies.
- Do not redesign the UI.
- Do not change the folder structure.
- Do not duplicate reusable components.
- Do not modify Parent App logic that is not part of Student App transformation.
- Do not change or break existing APIs unless a student-specific endpoint is required and documented.
- Preserve proven architecture, branding, offline patterns, and production-ready flows.

## Phase 1 Conclusion

This document fulfills Phase 1 by auditing the project and identifying:

- reusable components and services
- parent-specific screens and API patterns
- student-facing transformation targets
- app identity and navigation updates
- next-phase deliverables and risks

## Next Actions

1. Finalize the API mapping and identify the exact student-facing endpoints.
2. Rename app identity metadata and preserve existing Expo assets.
3. Refactor auth flow for student login and session state.
4. Update navigation to reflect student app modules and remove parent-only flows.
5. Convert parent screens into student screens while keeping reusable UI and offline patterns.
6. Verify security and authorization for student-only data access.
7. Run `npx tsc --noEmit` after transformational changes.
8. Generate final release reports after verification.
