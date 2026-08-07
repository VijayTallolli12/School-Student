/**
 * HeroCard — Design System. Premium greeting hero for the dashboard.
 * Fully responsive: no fixed heights, flexible text column (names/class info
 * wrap or auto-shrink instead of clipping), proportional avatar sizing and
 * automatic height so nothing is ever cropped on small phones, landscape or
 * tablet widths.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "./Avatar";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import { useScreenSize } from "@/design-system/responsive";

export interface HeroCardProps {
  greeting: string;
  dateLine: string;
  studentName: string;
  classLine?: string;
  avatarUri?: string | null;
  schoolLogo?: string | null;
  schoolName?: string | null;
  /** Single dynamic contextual message (homework due, upcoming exam, etc). */
  context?: string;
  streak?: number;
  onAvatarPress?: () => void;
}

export const HeroCard = memo(function HeroCard({
  greeting,
  dateLine,
  studentName,
  classLine,
  avatarUri,
  context,
  streak,
}: HeroCardProps) {
  const { colors } = useTheme();
  const { isSmallPhone, isTablet } = useScreenSize();

  // Avatar scales with screen width: 72 on small phones, 96 on tablets/large.
  const avatarSize = isSmallPhone ? "xl" : isTablet ? "hero" : "xl";
  const horizontalPad = isSmallPhone ? spacing.lg : spacing.xl;

  return (
    <View
      style={{
        backgroundColor: colors.brand,
        borderRadius: radius["2xl"],
        padding: horizontalPad,
        overflow: "hidden",
      }}
    >
      {/* Decorative soft circles — clipped by overflow, never layout-critical */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -40,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: "rgba(255,255,255,0.12)",
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -50,
          left: -20,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "rgba(255,255,255,0.08)",
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        {/* Text column shrinks first so long names never push the avatar off-screen */}
        <View style={{ flex: 1, flexShrink: 1, zIndex: 1, paddingRight: spacing.md, minWidth: 0 }}>
          <Text
            style={{ fontSize: 13, lineHeight: 18, color: "rgba(255,255,255,0.85)", fontWeight: "600", flexShrink: 1 }}
            numberOfLines={1}
            accessibilityLabel={greeting}
          >
            {greeting}
          </Text>
          <Text
            style={{ fontSize: 12, lineHeight: 17, color: "rgba(255,255,255,0.7)", fontWeight: "500", marginTop: 2, flexShrink: 1 }}
            numberOfLines={1}
          >
            {dateLine}
          </Text>
          <Text
            accessibilityRole="header"
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            numberOfLines={2}
            style={{
              ...typeScale.headlineSm,
              color: "#FFFFFF",
              marginTop: spacing.xs,
              lineHeight: 32,
              flexShrink: 1,
            }}
          >
            {studentName}
          </Text>
          {context ? (
            <Text
              style={{ fontSize: 13, lineHeight: 19, color: "rgba(255,255,255,0.92)", fontWeight: "500", marginTop: spacing.xs, flexShrink: 1 }}
              numberOfLines={2}
            >
              {context}
            </Text>
          ) : null}
        </View>

        {/* Avatar — ringed photo, scales proportionally with screen width */}
        <View style={{ zIndex: 1, marginLeft: spacing.sm, padding: 2, flexShrink: 0 }}>
          <View
            style={{
              borderRadius: radius.full,
              borderWidth: 3,
              borderColor: "rgba(255,255,255,0.95)",
              shadowColor: "#131022",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Avatar uri={avatarUri} name={studentName} size={avatarSize} />
          </View>
        </View>
      </View>

      {/* Student info + school badge — row wraps so nothing overlaps */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: spacing.md,
          zIndex: 1,
        }}
      >
        {classLine ? (
          <Text
            style={{ flex: 1, flexShrink: 1, color: "rgba(255,255,255,0.85)", fontSize: 12.5, lineHeight: 18, fontWeight: "600", minWidth: 0 }}
            numberOfLines={1}
          >
            {classLine}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {streak && streak > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: radius.full,
              paddingHorizontal: spacing.sm,
              height: 26,
              marginLeft: spacing.sm,
            }}
          >
            <Ionicons name="flame" size={14} color="#FFD60A" />
            <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 12, marginLeft: 4, lineHeight: 16 }}>
              {streak}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});