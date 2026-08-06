# Motion Guide

All motion lives in `motion.ts` and the `Motion.tsx` primitives. Golden rule:
**subtle, fast, meaningful — never gimmicky.**

## Tokens

| Token            | Value | Use |
| ---------------- | ----- | --- |
| `durationFast`   | 120ms | Feedback: press, toggle |
| `durationBase`   | 200ms | Entrances, transitions |
| `durationSlow`   | 260ms | Sheet/dropdown, emphasis |

Easing: `Easing.out(Easing.cubic)` for entrances; the press uses a spring
(`speed 30–40`, `bounciness ≤ 4`).

## Primitive usage

### PressableScale (feedback)
```tsx
<PressableScale onPress={go} accessibilityRole="button">…</PressableScale>
```
Scale 0.97 on press, spring back. Disable with `noScale`.

### FadeInView (entrance)
```tsx
<FadeInView index={0}>…</FadeInView>
```
Fade + 8px rise. `index` staggers siblings by 45ms. **Max ~6 siblings.**

## Rules

1. Duration ≤ 250ms for any single animation.
2. `useNativeDriver: true` only — animating only `opacity` and `transform`.
3. Don't animate layout properties (`width`, `height`, `top`).
4. Reuse `PressableScale`/`FadeInView` instead of hand-rolling Animated.
5. No auto-playing loops or full-screen entrance choreography on app load.
6. Respect Reduce Motion: keep scale to 0.97 and fades ≤ 8px so they read as
   "polish", not movement, for sensitive users.