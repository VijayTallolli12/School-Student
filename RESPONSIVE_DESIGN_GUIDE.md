# RESPONSIVE_DESIGN_GUIDE

Conventions for building screens that adapt across every device in this project.

## 1. Always measure, never assume
- Use `useScreenSize()` / `useAdaptiveColumns()` from `@/design-system` instead of hardcoding pixel widths.
- Breakpoints: `phone` < 400, `phoneLg` 400–639, `tablet` 640–959, `desktop` ≥ 960.

```ts
const { isTablet } = useScreenSize();
const cols = useAdaptiveColumns({ phone: 2, phoneLg: 3, tablet: 3, desktop: 4 });
```

## 2. Grids
- Use `Grid columns={cols} gap={spacing.md}` for stat cards, quick actions and any equal-width tile grid.
- The `Grid` self-measures; on small phones reduce `columns`, on tablets raise it. Never hardcode `flex: 1` rows with more than 2 items on phone widths.

## 3. No fixed sizes
- Prefer `flex`, `flexGrow`, `flexShrink`, `flexBasis`, `aspectRatio`, `maxWidth`, `minWidth`.
- Fixed dimensions allowed only for: identity boxes (logos/avatars), icon tiles, chrome (tab bar, header buttons), decorative shapes.
- Give text columns `flexShrink: 1` + `minWidth: 0` so long strings never push siblings off-screen.

## 4. Text
- Use `typeScale` tokens; for dynamic type, prefer `DesignText` (`role`) which applies device font scale.
- `numberOfLines`: 1 only for chrome/labels; 2 for titles/names; never truncate user content (reasons, names, exam/doc titles) — wrap instead.
- For critical values that must stay on one line, use `adjustsFontSizeToFit` + `minimumFontScale`.

## 5. Cards
- `Card` padding from tokens. Never set a fixed height — let content define it.
- Keep corner radius consistent via `radius` tokens.

## 6. Safe areas
- Wrap screens in `AppContainer` (handles top/left/right safe area + tablet content cap + keyboard scroll).
- Standalone screens (splash, auth): `SafeAreaView` with explicit `edges`.
- Bottom sheets / overlays: pad bottom by `useSafeAreaInsets().bottom`.

## 7. Touch targets
- Interactive elements: ≥ 44×44 effective. Small visual controls (32–40pt) need `hitSlop` to reach 44.

## 8. Keyboard
- Put forms inside `KeyboardScrollView` or `AppContainer` (scroll). Inputs register automatically via `useRegisterFocusedInput()`.
- Keep `keyboardShouldPersistTaps="handled"` so taps work with the keyboard open.

## 9. Performance
- Memoize components (`memo`), keep hooks at the top level (never call hooks inside JSX), and let the `Grid` measure once via `onLayout` (percentage fallback pre-measure = no layout jump).
- Prefer `useNativeDriver: true` for transforms/opacity.

## 10. Landscape / tablet
- `AppContainer` caps content at `720` on tablets automatically; leave it on.
- Height-based overlays (modals) must derive size from `useWindowDimensions` each render, not a module-level constant.
