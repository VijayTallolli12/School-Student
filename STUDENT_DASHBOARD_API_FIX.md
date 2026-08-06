# STUDENT_DASHBOARD_API_FIX

Date: 2026-08-06
Project: school-student (Expo SDK 54)
Scope: Student dashboard API contract fix, request/response verification, and source cleanup

## Root Cause
- The Student App was not consuming the backend's single dashboard contract.
- The app previously depended on obsolete dashboard logic and route assumptions from the parent-style implementation.
- The correct backend endpoint is `GET /api/v1/student/dashboard`, but the client had been routed through alternate dashboard paths and fallback logic.

## Files Modified
- [src/services/api.ts](src/services/api.ts)
- [src/app/(tabs)/(home)/index.tsx](src/app/(tabs)/(home)/index.tsx)

## Dashboard API Verification
- The Student App now uses only `GET /api/v1/student/dashboard` for the dashboard screen.
- No calls remain to `/students/{uuid}/dashboard`.
- No calls remain to `/student/dashboard` without the configured API base path.
- Dashboard synthesis from multiple APIs was removed.
- The dashboard screen now renders from the single backend response returned by the student dashboard endpoint.

## API Base URL Verification
- Base URL source: [src/config/api.ts](src/config/api.ts)
- Current value resolves to `http://192.168.1.3:8000/api/v1`
- Final request URL logged by the app is `http://192.168.1.3:8000/api/v1/student/dashboard`

## Authorization Header Verification
- The Axios request interceptor resolves the token and attaches `Authorization: Bearer <token>`.
- The dashboard request log prints the resolved bearer token value at request time.
- Token source order remains secure store, AsyncStorage fallback, then persisted auth store fallback.

## Token Verification
- The dashboard request uses the same resolved access token path as the rest of the API client.
- If the token is missing, the request is sent without an Authorization header and the response will fail normally rather than synthesizing data.
- Refresh flow remains available for 401 responses.

## Exact Request Logging
- Request log emitted from [src/services/api.ts](src/services/api.ts):
  - method: `GET`
  - url: `http://192.168.1.3:8000/api/v1/student/dashboard`
  - authHeader: resolved bearer token value
- Response log emitted from [src/services/api.ts](src/services/api.ts):
  - status
  - statusText
  - raw response body

## Response Handling
- If backend returns HTTP 200, the app unwraps the response and renders the dashboard.
- If backend returns a non-200 response, the existing error handling path displays the failure cleanly.
- No multi-API synthesis is used.

## Removed Obsolete Dashboard Implementation
- Removed the composed dashboard assembly that combined attendance, fees, exams, notifications, and `/me` data.
- Removed fallback dependency on `/me/dashboard` and `/students/{uuid}/dashboard`.
- Removed dashboard bootstrap logic that was trying to infer dashboard state before calling the backend endpoint.

## Validation
- `npx tsc --noEmit` -> PASS

## Notes
- Laravel was not modified.
- Parent App code was not modified.
- The report is based on source inspection and the verified backend contract provided by the user.
