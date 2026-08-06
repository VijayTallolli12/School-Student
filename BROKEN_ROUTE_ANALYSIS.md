# BROKEN_ROUTE_ANALYSIS — Root Cause Report

## Symptom

Navigating **Academics → Transport** showed:

- `Unmatched Route`
- `Page could not be found`

## Root Cause

The Academics hub (`src/app/(tabs)/(home)/academics.tsx`) declared the Transport
card's navigation route as:

```
route: "/transport/index"
```

In **Expo Router v6 (SDK 54)** a directory `index.tsx` registers as the
**directory path**, not the literal `/dir/index` path:

| File | Registered route (v6) | `"…/index"` literal |
|------|------------------------|----------------------|
| `transport/index.tsx` | `/transport` | ❌ **NOT a route** |

This is confirmed by the generated typed-routes declaration
(`.expo/types/router.d.ts`, `experiments.typedRoutes = true`), which lists
`/transport`, `/transport/driver`, `/transport/route` — but **no**
`/transport/index`.

Therefore `router.push("/transport/index")` resolved to a path that does not
exist in the route tree → Expo Router's Unmatched Route fallback was shown.

## Affected References (all `/transport/index`)

| File | Line | Usage | Impact |
|------|------|-------|--------|
| `src/app/(tabs)/(home)/academics.tsx` | 23 | `ACADEMIC_MODULES` Transport card | **REPRODUCES THE BUG** |
| `src/app/(tabs)/(home)/transporation.tsx` | 7 | `router.replace("/transport/index")` | Always redirects to a missing route |
| `src/app/(tabs)/(home)/transportation.tsx` | 7 | `router.replace("/transport/index")` | Always redirects to a missing route |

The two `transporation` / `transportation` files were also duplicated, misnamed,
**dead** alias screens: no code anywhere navigates to `/transportation` or
`/transporation`, so they could only ever produce a broken redirect.

## Why This Went Unnoticed

- Every `router.push` uses `route as Href`, which silently bypasses the Expo
  Router typed-routes validation (no TypeScript error raised).
- The screens themselves compiled and exported fine; the failure only appears at
  runtime when the href is actually navigated.

## Resolution

1. `academics.tsx` → Transport card route corrected to `"/transport"`.
2. Removed both dead alias files and their `Stack.Screen` registrations in
   `src/app/(tabs)/(home)/_layout.tsx`.

No backend/API changes were made (out of scope for this task).
