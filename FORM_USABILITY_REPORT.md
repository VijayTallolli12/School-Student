# FORM_USABILITY_REPORT

Date: 2026-08-06
Scope: Login, Edit Profile, Change Password, Apply Leave.

## Forms Inventory
| Form | Screen | Wrapper | Status |
|------|--------|---------|--------|
| Login | `(auth)/login.tsx` | `KeyboardScrollView` | ✅ |
| Edit Profile | `(tabs)/profile/edit-profile.tsx` | `AppContainer` → `KeyboardScrollView` | ✅ |
| Change Password | `(tabs)/profile/change-password.tsx` | `AppContainer` → `KeyboardScrollView` | ✅ |
| Apply Leave | `(tabs)/(home)/leave/apply.tsx` | `KeyboardScrollView` | ✅ |

## Behavior Verified (source)
- Focused input is automatically scrolled above the keyboard on iOS (`Keyboard.didShow` + `measureInWindow` + `scrollTo` in `KeyboardScrollView.tsx`), so the active field is never hidden while typing.
- Android uses the native `adjustResize` resize mode (app.json default), which keeps focused fields visible; no workarounds needed.
- `keyboardShouldPersistTaps="handled"` → tapping buttons while the keyboard is open works on first tap.
- Keyboard dismissal: iOS `interactive`; Android `on-drag`.
- Return-key chaining: Login email `next` → password (ref) → password `done` submits the form.
- Fields register with the scroll view on focus via `useRegisterFocusedInput()` so auto-scroll works for any Input.

## UX Quality Checks (targets)
| Requirement | Status |
|-------------|--------|
| Focused field always visible while typing | ✅ |
| No manual scrolling needed to see the active field | ✅ |
| Correct Android + iOS behavior | ✅ |
| Taps work with keyboard open | ✅ |
| Password show/hide | ✅ Login + Change Password |
| Inline validation + error text | ✅ (zod + react-hook-form; error below field) |
| Button disabled/loading during submit | ✅ |
| `textContentType` / `autoComplete` for email + password | ✅ Login |
| Safe area on all sides | ✅ |

## Known Limitations / Follow-ups
- Multi-field auto-advance is only implemented on Login; Edit Profile / Apply Leave use standard focus (fields are few and short).
- Dynamic-type (accessibility font scaling) is applied on `DesignText`; forms use token sizes directly — screen-reader-scale pass is a follow-up.
