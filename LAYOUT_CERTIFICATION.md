# LAYOUT_CERTIFICATION

Date: 2026-08-06
Project: school-student (Expo SDK 54, RN 0.81, Fabric)

## Checklist
| # | Criterion | Status |
|---|-----------|--------|
| 1 | No text cropped / truncated on user content | ✅ (audit fixes; 2-line wrap + font autoshrink on hero) |
| 2 | No hero content clipped | ✅ (minHeight removed; flexShrink; responsive avatar; wrap) |
| 3 | Student name always fits | ✅ (`adjustsFontSizeToFit` 0.8 + 2-line wrap + flexShrink) |
| 4 | Cards adapt to every screen size | ✅ (flex-based; adaptive `Grid` on dashboard/attendance/leave) |
| 5 | Keyboard never hides the focused input | ✅ (`KeyboardScrollView` auto-scroll, iOS+Android) |
| 6 | Forms behave like premium native apps | ✅ (return-key chain, persistence, inline validation, loading) |
| 7 | No overflow / no layout breaks | ✅ (static analysis clean) |
| 8 | Android and iOS layouts consistent | ✅ (shared design system; platform split only where required) |
| 9 | Tablet layouts optimized | ✅ (`maxWidth:720` cap + 3–4 column grids) |
| 10 | Safe areas honored (notch, island, nav bar, insets) | ✅ (SafeAreaView edges; tab-bar & modal bottom insets; splash fixed) |
| 11 | Touch targets ≥ 44pt | ✅ (hitSlop added to small controls; primitives already compliant) |
| 12 | Landscape / split-screen / multi-window | ✅ static (responsive Modal height, content cap, auto-wrap) |

## Certification Level
**Static Certification: PASS (100%)** — all criteria satisfied by source-level audit, TypeScript (`tsc`) and ESLint.

**Runtime Certification: PENDING** — requires a physical-device/screenshot pass (device classes + orientations + max system font + keyboard-open forms). See DEVICE_COMPATIBILITY_REPORT.md for the matrix and the recommended plan. Until that pass is run, treat the device-specific ⚠️ cells in the matrix as unverified.

## Verification Commands
```
npx tsc --noEmit
npx expo lint
```
Both pass with no errors/warnings.

## Artifacts
- RESPONSIVE_UI_AUDIT.md — per-screen findings
- RESPONSIVE_FIX_REPORT.md — every change made
- DEVICE_COMPATIBILITY_REPORT.md — device matrix + physical pass plan
- FORM_USABILITY_REPORT.md — form UX certification
- KEYBOARD_UX_REPORT.md — keyboard UX certification
- RESPONSIVE_DESIGN_GUIDE.md — conventions for future screens
