# BOTTOM_TABBAR_ROOT_CAUSE.md

## Crash

```
TypeError: Cannot read property 'forEach' of null
react-native/Libraries/StyleSheet/processTransform.js
```

Reported origin: `src/components/BottomTabBar.tsx`
Environment: Expo SDK 54, React Native 0.81.5, `newArchEnabled: true` (Fabric), Android.

## Root cause (confirmed in the actual renderer + style source, not guessed)

### 1. `processTransform` has no `null` guard

`node_modules/react-native/Libraries/StyleSheet/processTransform.js` (RN 0.81):

```js
function processTransform(transform: Array<Object> | string) {
  ...
  if (__DEV__) {
    _validateTransforms(transform);   // <-- no null check before this
  }
  ...
}

function _validateTransforms(transform: Array<Object>): void {
  transform.forEach(transformation => {  // <-- null.forEach throws
```

`transform: null` reaches `transform.forEach(...)` → `TypeError: Cannot read property 'forEach' of null`.

`transform` is registered as a processed style attribute in
`Libraries/Components/View/ReactNativeStyleAttributes.js`:

```js
transform: {process: processTransform},
```

### 2. The Fabric renderer converts `undefined` → `null`

`node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js`, inside
`diffProperties` (line ~1344):

```js
for (propKey in nextProps)
  if ((attributeConfig = validAttributes[propKey])) {
    var prevProp = prevProps[propKey];
    var nextProp = nextProps[propKey];
    ...
    "undefined" === typeof nextProp &&
      ((nextProp = null), ...);           // <-- transform: undefined becomes null
    ...
    else if (prevProp !== nextProp)
      ...
      else if (diff || process) {
        if (void 0 === prevProp || ...differs...) {
          attributeConfig.process(nextProp);  // <-- processTransform(null)
```

So **if the `transform` key is present in a style object with value `undefined`**, the
renderer coerces it to `null` and feeds it to `processTransform`, which crashes.

Two ways this fires:

- **Initial mount:** every non-focused tab renders `transform: undefined` → `prevProp` is
  undefined → `void 0 === prevProp` is true → `processTransform(null)` → crash.
- **Focus change:** a tab going focused → unfocused changes `transform` from an array to
  `undefined` → `undefined !== array` → reprocessed as `null` → crash.

Omitting the `transform` key entirely would be safe (the key is never iterated), but a
present-but-`undefined` value is fatal.

### 3. The offending code

`src/components/BottomTabBar.tsx:88`:

```tsx
transform: isFocused ? [{ translateY: -1 }] : undefined,   // BUG
```

This is why the crash is attributed to `BottomTabBar.tsx` — that component mounts
`transform: undefined` on every unfocused tab and re-renders it on every tab switch.

## Full audit — every `transform` in `src`

| File:Line | Code | Verdict |
|-----------|------|---------|
| `src/components/BottomTabBar.tsx:88` | `transform: isFocused ? [...] : undefined` | **BUG — fixed** |
| `src/app/index.tsx:51` | `transform: [{ scale: scaleAnim }]` (Animated.Value, Animated.View) | Safe — always array |
| `src/design-system/components/Modal.tsx:87` | `transform: [{ translateY }]` (Animated.Value, Animated.View) | Safe — always array |
| `src/design-system/components/Toast.tsx:101` | `transform: [{ translateY }]` (Animated.Value, Animated.View) | Safe — always array |
| `src/design-system/components/HomeworkCard.tsx:42` | `transform: [{ scale: pressed ? 0.99 : 1 }]` | Safe — always array/number |
| `src/design-system/components/NotificationCard.tsx:132` | `transform: [{ scale: pressed ? 0.99 : 1 }]` | Safe — always array/number |
| `src/design-system/components/Motion.tsx:63` | `[style, !noScale && { transform: [{ scale }] }]` | Safe — `false` element is dropped by `flattenStyle`; active case always array |
| `src/design-system/components/Motion.tsx:107` | `[{ opacity, transform: [{ translateY }] }, style]` | Safe — always array |

No `useAnimatedStyle`, `interpolate`, or Moti are used anywhere in `src` — Reanimated is not
involved in this crash. No NativeWind `className` transform utilities are used either.

## Platform validation

- **Android / Fabric:** this is the Fabric renderer path (RN 0.81 + `newArchEnabled: true`),
  so the undefined→null→`processTransform(null)` behavior is identical on Android and iOS.
- **Reanimated compatibility:** `BottomTabBar` uses only core RN (`View`, `Pressable`,
  `react-native-safe-area-context`). The fix requires no Reanimated changes.
