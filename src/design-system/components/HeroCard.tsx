/**
 * HeroCard — Design System. Premium greeting hero for the dashboard.
 * Combines: greeting + date, student avatar (photo, ringed), subtle school
 * branding, a single dynamic contextual message, and student info line.
 * Kept compact (~25% shorter than legacy) to reduce dashboard scroll.
 */
import { memo } from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "./Avatar";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";

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
  schoolLogo,
  schoolName,
  context,
  streak,
}: HeroCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.brand,
        borderRadius: radius["2xl"],
        padding: spacing.lg,
        overflow: "hidden",
        minHeight: 150,
      }}
    >
      {/* Decorative soft circles */}
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
        <View style={{ flex: 1, zIndex: 1, paddingRight: spacing.md }}>
          <Text
            style={{ fontSize: 13, lineHeight: 18, color: "rgba(255,255,255,0.85)", fontWeight: "600" }}
            numberOfLines={1}
            accessibilityLabel={`${greeting}, ${dateLine}`}
          >
            {greeting} · {dateLine}
          </Text>
          <Text
            accessibilityRole="header"
            style={{
              ...typeScale.headlineSm,
              color: "#FFFFFF",
              marginTop: spacing.xs,
              lineHeight: 32,
            }}
            numberOfLines={1}
          >
            {studentName}
          </Text>
          {context ? (
            <Text
              style={{ fontSize: 13, lineHeight: 19, color: "rgba(255,255,255,0.92)", fontWeight: "500", marginTop: spacing.xs }}
              numberOfLines={1}
            >
              {context}
            </Text>
          ) : null}
        </View>

        {/* Avatar — premium ringed photo with a little breathing room */}
        <View style={{ zIndex: 1, marginLeft: spacing.sm, padding: 2 }}>
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
            <Avatar uri={avatarUri} name={studentName} size="xl" />
          </View>
        </View>
      </View>

      {/* Student info + prominent school badge */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.md, zIndex: 1 }}>
        {classLine ? (
          <Text
            style={{ flex: 1, color: "rgba(255,255,255,0.85)", fontSize: 12.5, lineHeight: 18, fontWeight: "600" }}
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
              marginRight: spacing.sm,
            }}
          >
            <Ionicons name="flame" size={14} color="#FFD60A" />
            <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 12, marginLeft: 4, lineHeight: 16 }}>
              {streak}
            </Text>
          </View>
        ) : null}

        {schoolLogo || schoolName ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.45)",
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              height: 28,
              overflow: "hidden",
            }}
          >
            {schoolLogo ? (
              <Image source={{ uri: schoolLogo }} style={{ width: 18, height: 18, borderRadius: 9 }} accessibilityIgnoresInvertColors />
            ) : (
              <Ionicons name="school" size={14} color="#FFFFFF" />
            )}
            <Text
              style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 12, marginLeft: 6, lineHeight: 18 }}
              numberOfLines={1}
            >
              {schoolName || "School"}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});
