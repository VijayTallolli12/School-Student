# KEYBOARD_BEHAVIOR_REPORT — Implementation & Behavior Matrix

Built-in React Native keyboard handling. No third-party keyboard library is installed.

## Architecture

```
Screen
└── SafeAreaView (react-native-safe-area-context)
    └── KeyboardScrollView              (src/design-system/components/KeyboardScrollView.tsx)
        ├── KeyboardAvoidingView        (behavior="padding" on iOS, undefined on Android)
        │   └── ScrollView
        │       ├── keyboardShouldPersistTaps="handled"
        │       ├── keyboardDismissMode="interactive" (iOS) / "on-drag" (Android)
        │       └── onScroll → tracks offset, scrollEventThrottle={16}
        └── Context: Inputs register themselves on focus → auto-scroll
```

- **iOS:** `KeyboardAvoidingView` shrinks the scroll frame; the container listens to
  `Keyboard` `keyboardDidShow`, measures the focused field with `measureInWindow`, and
  `scrollTo`s it above the keyboard with a `bottomOffset` gap. Switching fields while the
  keyboard is open scrolls immediately.
- **Android:** Expo-default `adjustResize` resizes the window; the field stays visible
  natively. No manual scrolling is performed.
- `Input` (`src/components/ui/Input.tsx`) forwards its ref and calls
  `useRegisterFocusedInput()` on focus.

## Platform behavior

| | iOS | Android |
|---|---|---|
| Window resize | Never (keyboard overlays) | Yes — default `adjustResize` |
| Offset ownership | `KeyboardAvoidingView` padding + manual `scrollTo` | Native resize |
| Dismiss by drag | `keyboardDismissMode="interactive"` | `keyboardDismissMode="on-drag"` |
| Dismiss by tap outside | Yes — `keyboardShouldPersistTaps="handled"` | Yes |
| Tab bar | Never pushed up | Never pushed up (window resizes, bar stays) |

## Behavior matrix (what the user sees)

| Screen | Field focused | Result |
|--------|---------------|--------|
| Login | Email | Field scrolls above keyboard; Next key → Password; Done submits |
| Login | Password | Field visible; Done key submits |
| Apply Leave | Reason (multiline) | Field + error text scroll above keyboard; chips/date pickers still tappable while keyboard is open |
| Change Password | any of 3 | Field scrolls above keyboard on iOS; visible natively on Android |
| Edit Profile | Address (multiline) | Field visible with its label |
| Any `AppContainer` screen | any future input | Inherited auto-scroll + dismiss |

## Files changed

| File | Change |
|------|--------|
| `package.json` / lockfile | `react-native-keyboard-controller` removed |
| `metro.config.js` | Restored to Expo + NativeWind default (no custom resolver) |
| `app.json` | `softwareKeyboardLayoutMode` removed (Expo default `adjustResize` restored) |
| `src/app/_layout.tsx` | `KeyboardProvider`/`KeyboardToolbar` removed (plain `QueryProvider` + `Stack`) |
| `src/design-system/components/KeyboardScrollView.tsx` | **New** — built-in keyboard-aware scroll container + `useRegisterFocusedInput` context |
| `src/design-system/components/Screen.tsx` | `AppContainer` renders `KeyboardScrollView` |
| `src/design-system/components/index.ts` | Exports `KeyboardScrollView` + `useRegisterFocusedInput` |
| `src/components/ui/Input.tsx` | Forwards ref + registers focused field for auto-scroll |
| `src/app/(auth)/login.tsx` | Uses `KeyboardScrollView`; Email `next` → focus Password |
| `src/app/(tabs)/(home)/leave/apply.tsx` | Uses `KeyboardScrollView` (multiline Reason auto-scrolls) |

## Verification

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ 0 errors |
| ESLint | `npx expo lint` | ✅ 0 errors |
| Expo doctor | `npx expo-doctor` | ✅ |
| Dependency removed | `npm ls react-native-keyboard-controller` | ✅ empty |

## Manual test checklist (device)

- [ ] Focus the Reason field in Apply Leave on a small-screen iOS device — field stays above
      the keyboard with a gap.
- [ ] Same on Android — window resizes and the field stays visible.
- [ ] Login: press Next on Email → focus moves to Password; Done submits.
- [ ] Edit Profile: focus Address → full label + field visible; drag down dismisses keyboard.
- [ ] Apply Leave: with keyboard open, tap a Leave Type chip — it still responds.
- [ ] iOS: switching between fields while the keyboard is open scrolls correctly each time.
