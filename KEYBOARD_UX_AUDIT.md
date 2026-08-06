# KEYBOARD_UX_AUDIT — Findings & Remediation

Audit of every text-entry surface in the Student App, the keyboard problems found,
and the fixes applied so the focused input is never hidden behind the keyboard —
implemented **only** with React Native built-ins (`KeyboardAvoidingView`, `ScrollView`,
`keyboardShouldPersistTaps`, Safe Area APIs).

## Scope

Every screen containing a `TextInput` or `SearchBar`, plus the shared scroll/input
primitives (`AppContainer`, `Input`, `ScreenWrapper`).

| Screen | Fields | Previous keyboard handling | Issue |
|--------|--------|----------------------------|-------|
| `src/app/(auth)/login.tsx` | Email, Password | `KeyboardAvoidingView` (iOS `padding`) + `ScrollView` `keyboardShouldPersistTaps="handled"` | No auto-scroll guarantee; "next" return key dead |
| `src/app/(tabs)/(home)/leave/apply.tsx` | Reason (multiline), date pickers | `KeyboardAvoidingView` + `ScrollView` | Multiline Reason could be hidden by keyboard on small screens |
| `src/app/(tabs)/profile/change-password.tsx` | 3 password fields | `AppContainer` (plain ScrollView) | No keyboard awareness |
| `src/app/(tabs)/profile/edit-profile.tsx` | Email, Phone, Address (multiline) | `AppContainer` (plain ScrollView) | No keyboard awareness; Address hidden |
| `src/components/ScreenWrapper.tsx` | — | Plain `ScrollView` | Dead code — no screen uses it |
| `src/design-system/components/Screen.tsx` (`AppContainer`) | — | Plain `ScrollView` | All `AppContainer`-based screens had no keyboard awareness |

## Findings

1. **No auto-scroll guarantee.** Login/apply had `KeyboardAvoidingView` + `ScrollView`, but
   on small screens the focused field (especially the multiline Reason) could sit under the
   keyboard. Change-password/edit-profile had no keyboard handling at all.
2. **Return-key dead-end.** `login.tsx` set `returnKeyType="next"` on Email but never focused
   Password.
3. **No dismiss affordance.** No drag-to-dismiss on the shared scroll container.
4. **Input could not be focused programmatically.** `src/components/ui/Input.tsx` did not
   forward a ref, so return-key chaining was impossible.

## Remediation (built-in APIs only)

| Change | Where |
|--------|-------|
| New `KeyboardScrollView`: `KeyboardAvoidingView` (iOS `padding`) wrapping `ScrollView` with `keyboardShouldPersistTaps="handled"` + drag/interactive dismiss; on iOS it auto-scrolls the focused field above the keyboard via `Keyboard` events + `measureInWindow`; Android relies on native `adjustResize` | `src/design-system/components/KeyboardScrollView.tsx` |
| `AppContainer` now renders `KeyboardScrollView` — every `AppContainer` screen is keyboard-aware for free | `src/design-system/components/Screen.tsx` |
| `Input` forwards its ref **and** registers the focused field on the scroll container via `useRegisterFocusedInput()` | `src/components/ui/Input.tsx` |
| `login.tsx`: uses `KeyboardScrollView`; Email `next` → focus Password; Password `done` → submit | `src/app/(auth)/login.tsx` |
| `leave/apply.tsx`: uses `KeyboardScrollView`; multiline Reason auto-scrolls above the keyboard | `src/app/(tabs)/(home)/leave/apply.tsx` |
| `change-password.tsx` / `edit-profile.tsx`: inherit auto-scroll from `AppContainer` | both profile screens |

No third-party keyboard library is used. `react-native-keyboard-controller` was removed
from `package.json`, `metro.config.js` was restored to the Expo/NativeWind default, and the
Android `softwareKeyboardLayoutMode` stays at the Expo default (`adjustResize`).

## Verification

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ 0 errors |
| ESLint | `npx expo lint` | ✅ 0 errors |
| Expo doctor | `npx expo-doctor` | ✅ |

## Remaining issues

- `src/components/ScreenWrapper.tsx` is unused legacy code — kept for now (not removed in
  this task to avoid scope creep).
- On iOS the auto-scroll runs after `keyboardDidShow` (the standard, reliable moment); on
  Android the window resizes natively so no manual scroll is needed. Both should be sanity
  checked on a real device.
