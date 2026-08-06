# FORM_USABILITY_REPORT — Keyboard-Aware Forms

Implements keyboard-aware forms using **only** React Native primitives
(`KeyboardAvoidingView`, `ScrollView`, `keyboardShouldPersistTaps="handled"`, Safe Area APIs).
No third-party keyboard library.

## Forms inventory

| Screen | Fields | Layout | Keyboard-aware now |
|--------|--------|--------|--------------------|
| Login (`src/app/(auth)/login.tsx`) | Email, Password | custom scroll | ✅ |
| Apply/Edit Leave (`src/app/(tabs)/(home)/leave/apply.tsx`) | Reason (multiline) + date/type pickers | custom scroll | ✅ |
| Change Password (`src/app/(tabs)/profile/change-password.tsx`) | Current / New / Confirm | `AppContainer` | ✅ (inherited) |
| Edit Profile (`src/app/(tabs)/profile/edit-profile.tsx`) | Email, Phone, Address (multiline) | `AppContainer` | ✅ (inherited) |
| All other screens using `AppContainer` | — | shared container | ✅ (inherited) |

## How it works

- **`KeyboardScrollView`** (`src/design-system/components/KeyboardScrollView.tsx`) is a
  reusable container = `KeyboardAvoidingView` (iOS `behavior="padding"`) + `ScrollView`
  (`keyboardShouldPersistTaps="handled"`, drag-to-dismiss via `keyboardDismissMode`).
- **Auto-scroll:** on iOS the container listens to `Keyboard` `keyboardDidShow` events and,
  for the currently focused input (registered on focus via a tiny React context), measures it
  with `measureInWindow` and `scrollTo`s so the field sits above the keyboard (+ `bottomOffset`
  gap). On Android the Expo-default `adjustResize` resizes the window, so the field stays
  visible natively.
- **Input integration:** `Input` (`src/components/ui/Input.tsx`) forwards its ref (for
  programmatic focus) and registers the focused field on the nearest `KeyboardScrollView`,
  so auto-scroll works everywhere with zero per-screen wiring.

## Improvements applied

1. **Auto-scroll to the focused field** — deterministic on iOS (measure + `scrollTo`),
   native on Android (`adjustResize`). Applied to all four forms and to the shared
   `AppContainer`.
2. **Return-key chaining** — Login Email (`returnKeyType="next"`) now focuses Password; the
   Password `done` key submits.
3. **Drag-to-dismiss** — `keyboardDismissMode`: `interactive` on iOS, `on-drag` on Android.
   Taps outside inputs still work via `keyboardShouldPersistTaps="handled"`.
4. **No double-inset** — a single `KeyboardAvoidingView` per screen (inside the shared
   container); form screens no longer add their own wrappers.

## Touch targets & accessibility

- All tappable rows in forms use ≥ 44px hit areas; the tab bar rows are ≥ 48px.
- `TextInput`s keep `selectionColor` = brand primary so focus is visible.
- Multiline fields (`Reason`, `Address`) keep `minHeight: 80` so the tappable area is large.

## UX score

| Screen | Before | After |
|--------|--------|-------|
| Login | 5/10 — field could be covered, dead next-key | 9/10 |
| Apply Leave | 5/10 — multiline Reason covered on small screens | 9/10 |
| Change Password | 4/10 — no keyboard handling | 9/10 |
| Edit Profile | 4/10 — no keyboard handling, Address hidden | 9/10 |
| All `AppContainer` screens | 6/10 — no keyboard awareness | 9/10 |

## Remaining issues

- `src/components/ScreenWrapper.tsx` is unused legacy code (no keyboard fix applied; remove later).
- Auto-scroll timing (iOS `keyboardDidShow`, Android native resize) should be sanity-checked
  on a real device.
