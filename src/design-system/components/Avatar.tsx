/**
 * Avatar & StudentAvatar — Design System.
 * Image-first with graceful initials fallback. Optional ring/status dot.
 */
import { memo } from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "@/design-system/theme";
import { radius } from "@/design-system";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

const SIZES: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
  hero: 96,
};

const FONT_SIZES: Record<AvatarSize, number> = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 26,
  hero: 34,
};

export interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: AvatarSize;
  /** Brand ring around the avatar (premium hero look). */
  ring?: boolean;
}

function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "?";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export const Avatar = memo(function Avatar({ uri, name, size = "md", ring = false }: AvatarProps) {
  const { colors } = useTheme();
  const dim = SIZES[size];
  const fg = colors.textSecondary;

  return (
    <View
      accessible={false}
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: radius.full,
          backgroundColor: colors.surfaceSubtle,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        ring && { borderWidth: 3, borderColor: colors.elevated },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dim, height: dim, borderRadius: radius.full }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={{ fontSize: FONT_SIZES[size], fontWeight: "800", color: fg }}>
          {initials(name)}
        </Text>
      )}
    </View>
  );
});