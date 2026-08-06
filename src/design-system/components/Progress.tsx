/**
 * ProgressRing & ProgressBar — Design System.
 * SVG-based circular progress + linear bar. Token colors.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@/design-system/theme";
import { radius } from "@/design-system";

export interface ProgressRingProps {
  value: number; // 0..1
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export const ProgressRing = memo(function ProgressRing({
  value,
  size = 72,
  strokeWidth = 8,
  color,
  label,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const c = color ?? colors.brand;
  const v = Math.min(1, Math.max(0, value));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - v);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surfaceSunken} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={c}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
        />
      </Svg>
      {label ? (
        <View style={{ position: "absolute", alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{
              fontSize: size / 4.5,
              fontWeight: "800",
              color: colors.text,
              lineHeight: size / 3,
            }}
            accessibilityLabel={`${Math.round(v * 100)} percent`}
          >
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

export interface ProgressBarProps {
  value: number; // 0..1
  color?: string;
  trackColor?: string;
  height?: number;
}

export const ProgressBar = memo(function ProgressBar({
  value,
  color,
  trackColor,
  height = 8,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const v = Math.min(1, Math.max(0, value));
  return (
    <View
      style={{
        height,
        borderRadius: radius.full,
        backgroundColor: trackColor ?? colors.surfaceSunken,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <View
        style={{
          width: `${Math.round(v * 100)}%`,
          height,
          borderRadius: radius.full,
          backgroundColor: color ?? colors.brand,
        }}
      />
    </View>
  );
});