/**
 * FloatingActionButton — Design System.
 */
import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "./Motion";
import { useTheme } from "@/design-system/theme";
import { radius } from "@/design-system";

export interface FABProps {
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  label?: string;
}

export const FloatingActionButton = memo(function FloatingActionButton({ icon = "add", onPress, label }: FABProps) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label ?? icon}
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        backgroundColor: colors.brand,
        borderRadius: radius.full,
        paddingHorizontal: 20,
        height: 56,
        minWidth: 56,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        shadowColor: colors.brand,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <Ionicons name={icon} size={26} color="#FFFFFF" />
    </PressableScale>
  );
});