# DEVICE_COMPATIBILITY_REPORT

Date: 2026-08-06
Project: school-student (Expo SDK 54, RN 0.81, Fabric / new architecture)

## Device Matrix
The layout system is width-driven (`useWindowDimensions` → breakpoints 400 / 640 / 960). Predicted behavior per device class. ⚠️ = static analysis prediction; a physical device/screenshot pass is required to close the certification (see bottom).

| Device | Width (pt) | Breakpoint | Grid cols (default) | Hero avatar | Content cap | Notes |
|--------|-----------|-----------|--------------------|-------------|-------------|-------|
| Android 5.0" (360pt) | ~360 | phone | 2 | xl (72) | off | Stats 2-col; quick actions 2-col; name wraps/shrinks ⚠️ |
| Android medium (393pt) | ~393 | phone/phoneLg | 2 | xl (72) | off | Same as small; slightly roomier ⚠️ |
| Android large (412pt) | ~412 | phoneLg | 2–3 | xl (72) | off | Stats 3-col (≥400) ⚠️ |
| Pixel 8 (412pt) | ~412 | phoneLg | 2–3 | xl (72) | off | ⚠️ |
| Samsung S24 (360/384/412) | 360–412 | phone/phoneLg | 2–3 | xl (72) | off | Multi-resolver; all within adaptive path ⚠️ |
| OnePlus (412pt) | ~412 | phoneLg | 2–3 | xl (72) | off | ⚠️ |
| Nothing Phone (412pt) | ~412 | phoneLg | 2–3 | xl (72) | off | ⚠️ |
| Foldable (open ~674pt) | ~674 | tablet | 3–4 | hero (96) | 720 | Grid widens, content capped ⚠️ |
| iPhone SE (375pt) | ~375 | phone | 2 | xl (72) | off | Smallest iOS; 2-col grids keep cards ≥ ~150pt ⚠️ |
| iPhone 15 (393pt) | ~393 | phone | 2 | xl (72) | off | ⚠️ |
| iPhone 15 Pro Max (430pt) | ~430 | phoneLg | 3 | xl (72) | off | ⚠️ |
| iPad (768–834pt) | 768–834 | tablet | 3–4 | hero (96) | 720 | Centered max-width content ⚠️ |
| Android Tablet (800–960pt) | 800–960 | tablet/desktop | 4 | hero (96) | 720 | ⚠️ |

## Orientation
| Mode | Behavior |
|------|----------|
| Portrait | Primary layout; 1-column scroll with adaptive grids |
| Landscape (phones) | Rows become taller; `AppContainer` safe area keeps content off display cut-outs; grids still wrap (no horizontal scroll required) ⚠️ |
| Tablet landscape / multi-window | `maxWidth:720` centering keeps line lengths readable; `Modal` sheet height recomputed from current window ⚠️ |

## Cut-outs & System UI
- Status bar / notch / dynamic island: `SafeAreaView` edges top/left/right on all `AppContainer` screens + splash (all edges).
- Home indicator / gesture bar: `BottomTabBar` pads by `insets.bottom`; `Modal` pads by `insets.bottom`.
- Software nav bar (Android): tab bar bottom padding covers it.
- Keyboard: `KeyboardScrollView` (KeyboardAvoidingView iOS, `adjustResize` Android) + auto-scroll to focused input.

## Validation Status
- Static (source) verification: PASS (tsc + lint clean; audit in RESPONSIVE_UI_AUDIT.md).
- Physical device/screenshot verification: NOT YET RUN — requires `npx expo run:ios`/`run:android` on each class, or EAS Build + Device Farm, to capture screenshots and close ⚠️ items.

## Recommended Physical Pass
1. Expo Go / dev build on: iPhone SE, iPhone 15 Pro Max, Pixel 8, Samsung, iPad, Android tablet, foldable.
2. For each: portrait + landscape, split-screen, max system font size, keyboard open on every form.
3. Capture screenshots against the checklist in LAYOUT_CERTIFICATION.md.
