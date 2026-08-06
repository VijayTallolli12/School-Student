# STUDENT_API_CLEANUP_REPORT

Date: 2026-08-06
Scope: Phase 3.5 API contract enforcement and compatibility cleanup

## What Was Removed
- Endpoint fallback helpers:
  - `getWithFallback`
  - `postWithFallback`
  - `putWithFallback`
- Endpoint guessing strategy:
  - `/student/*` then `/students/{uuid}/*` then `/me/*`
- Legacy route aliases:
  - plural/singular and alternate path guesses used during temporary compatibility mode
- Development compatibility logs:
  - fallback try/404 logs
  - ad-hoc dashboard request/response logs

## What Was Kept
- Shared Axios client and interceptors
- Bearer token injection logic
- Refresh token handling and secure logout path
- Minimal response normalization helpers (`toRecord`, `toNumber`, `pickArray`, `pickObject`)

## Contract Enforcement Outcome
- Every student module now calls one explicit endpoint only.
- No service attempts multiple URLs.
- No silent route recovery remains.
- Screen API consumption stays routed through shared services.

## Files Updated
- `src/services/api.ts`

## Quality Validation
- `npx tsc --noEmit`: PASS
- `npx expo lint`: PASS

## Remaining Risks
- OpenAPI artifacts requested by task are not present in workspace; endpoint verification used user-provided contract list.
- `fetchExamSchedule` uses `/student/exams` and should be explicitly verified against `student-openapi.yaml` once available.
