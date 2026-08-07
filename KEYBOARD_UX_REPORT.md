# KEYBOARD_UX_REPORT

Date: 2026-08-06
Scope: Keyboard handling across all screens with text input.

## Implementation
`src/design-system/components/KeyboardScrollView.tsx` — the single keyboard-aware scroll container used by every form and by `AppContainer`:

- iOS: `KeyboardAvoidingView` (`behavior="padding"`) + `keyboardDidShow` listener → `measureInWindow()` on the registered focused field → `scrollTo()` with a `bottomOffset` so the caret sits comfortably above the keyboard.
- Android: native `adjustResize` (default Expo resize mode) resizes the window; the ScrollView content stays visible.
- `keyboardDismissMode`: `interactive` (iOS) / `on-drag` (Android).
- `keyboardShouldPersistTaps="handled"`: taps on buttons/links work while the keyboard is open.
- Focus registration: any `TextInput` may call `useRegisterFocusedInput()`; the built-in `Input` (`src/components/ui/Input.tsx`) registers itself on `onFocus`, and merges the forwarded ref (for programmatic focus / return-key chaining).
- `AppContainer` uses `bottomOffset = spacing.xl` and `paddingBottom = spacing["6xl"]` so last fields clear the keyboard and bottom insets.

## Screens Covered
| Screen | Container |
|--------|-----------|
| Login | `KeyboardScrollView` (bottomOffset `spacing.xl`, `bounces=false`) |
| Apply Leave | `KeyboardScrollView` |
| Edit Profile | `AppContainer` (scroll → `KeyboardScrollView`) |
| Change Password | `AppContainer` |

## Verification
- `npx tsc --noEmit` → PASS
- `npx expo lint` → PASS
- Behavior parity targets: WhatsApp / Google Keep / Apple Notes / Gmail — focused field stays above the keyboard, no manual scroll needed.

## Notes
- No third-party keyboard library is used (previous `react-native-keyboard-controller` dependency was fully removed; `metro.config.js` is back to default).
- Physical-device keyboard pass (iOS + Android, incl. large dynamic-type and hardware keyboards) is part of the open device-testing checklist.