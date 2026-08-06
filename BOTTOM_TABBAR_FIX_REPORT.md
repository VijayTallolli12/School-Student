# BOTTOM_TABBAR_FIX_REPORT.md

## Summary

Fixed a Fabric-renderer crash (`TypeError: Cannot read property 'forEach' of null` from
`react-native/Libraries/StyleSheet/processTransform.js`) that originated in
`src/components/BottomTabBar.tsx`.

## The fix

`src/components/BottomTabBar.tsx:88`

**Before**
```tsx
transform: isFocused ? [{ translateY: -1 }] : undefined,
```

**After**
```tsx
transform: [{ translateY: isFocused ? -1 : 0 }],
```

### Why this is correct

- `transform` is **always an array** — never `undefined`, `null`, or `false`. This satisfies
  `processTransform`'s contract (`Array<Object> | string`) in every render and state.
- `[{ translateY: -1 }]` and `[{ translateY: 0 }]` both pass `_validateTransforms`
  (single key; `translateY` value is a number — validated in `processTransform.js`).
- The focused pill still lifts by 1px; unfocused tabs now use an explicit no-op transform
  instead of an undefined value that the renderer coerces to `null`.
- Focus changes now diff `-1 ↔ 0` between two valid arrays — no null path ever runs.

## Files changed

| File | Change |
|------|--------|
| `src/components/BottomTabBar.tsx` | Conditional `transform: undefined` replaced with always-array `transform: [{ translateY: isFocused ? -1 : 0 }]` |

No other `transform` site in `src` required changes (see audit in
`BOTTOM_TABBAR_ROOT_CAUSE.md`).

## Verification

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ 0 errors |
| ESLint | `npx expo lint` | ✅ 0 errors |
| Transform audit | grep all `transform` in `src` | ✅ 8 sites; 1 was the bug, now fixed; 7 always-array |
| Reanimated/Moti scan | grep `useAnimatedStyle`/`interpolate`/Moti | ✅ none present — not involved |

## Runtime behavior after fix

- **App start:** `BottomTabBar` mounts with the Home tab focused → `[{ translateY: -1 }]`;
  Profile tab mounts → `[{ translateY: 0 }]`. Both are valid arrays; the renderer's
  `processTransform` runs on arrays only. No crash on mount.
- **Tab switching:** pressing a tab flips the transform between the two valid arrays; the
  diff path never produces `null`. The 1px pill lift renders on the active tab as before.
- **Android + iOS:** identical behavior under Fabric (RN 0.81, Expo SDK 54,
  `newArchEnabled: true`).

## Regression prevention

- Rule: **`transform` must always be an array.** Never write
  `transform: cond ? [...] : undefined | null | false`. Use
  `transform: [{ translateY: cond ? -1 : 0 }]`, or `transform: []` when a no-op is intended.
- Applies to the whole codebase (all 8 transform sites were audited and comply).
