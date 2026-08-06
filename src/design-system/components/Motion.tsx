/**
 * Motion primitives — Design System.
 * Subtle, fast (<250ms) animations built on the motion tokens. No flashy effects.
 */
import { memo, useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

const pressedScale = 0.97;

export interface PressableScaleProps extends PressableProps {
  /** Disables the press-scale animation (e.g. for simple feedback). */
  noScale?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * A pressable that gently scales inward on press and springs back on release.
 */
export const PressableScale = memo(function PressableScale({
  children,
  noScale = false,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: any) => {
      Animated.spring(scale, {
        toValue: pressedScale,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }).start();
      onPressIn?.(e);
    },
    [scale, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: any) => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      }).start();
      onPressOut?.(e);
    },
    [scale, onPressOut],
  );

  return (
    <Animated.View style={[style, !noScale && { transform: [{ scale }] }]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...rest}>
        {children}
      </Pressable>
    </Animated.View>
  );
});

/** Fades/translates a child in, optionally staggered by index. */
export function FadeInView({
  children,
  index = 0,
  style,
}: {
  children: React.ReactNode;
  index?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const delay = index * 45;
    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [opacity, translateY, index]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}