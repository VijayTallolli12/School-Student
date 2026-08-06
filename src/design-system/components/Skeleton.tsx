/**
 * Skeleton — Design System. Shimmer placeholders for loading states.
 */
import { memo, useEffect, useRef } from "react";
import { Animated, View, type ViewStyle } from "react-native";
import { useTheme } from "@/design-system/theme";
import { radius, motion } from "@/design-system";

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/** Single shimmering block. */
export const Skeleton = memo(function Skeleton({
  width = "100%",
  height = 14,
  radius: r = radius.sm,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: motion.shimmerDuration / 2, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: motion.shimmerDuration / 2, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width, height, borderRadius: r, backgroundColor: colors.surfaceSunken, opacity },
        style,
      ]}
    />
  );
});

/** Pre-built skeleton card used in lists. */
export const CardSkeleton = memo(function CardSkeleton({
  lines = 2,
  style,
}: {
  lines?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ paddingVertical: 6 }, style]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Skeleton width={48} height={48} radius={radius.full} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Skeleton width="70%" height={14} />
          {lines > 1 ? <View style={{ marginTop: 8 }}><Skeleton width="45%" height={12} /></View> : null}
        </View>
      </View>
    </View>
  );
});

/** List of skeleton cards with optional count + stagger. */
export const LoadingSkeleton = memo(function LoadingSkeleton({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <CardSkeleton />
        </View>
      ))}
    </View>
  );
});