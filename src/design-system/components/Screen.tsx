/**
 * Screen — AppContainer + AppHeader (Design System).
 * AppContainer: themed background + safe area + optional ScrollView.
 * AppHeader: consistent back/title/action header. min 44px touch targets.
 */
import { memo, type ReactNode } from "react";
import { View, Pressable, Text, type ViewStyle, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardScrollView } from "./KeyboardScrollView";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, safeArea, typeScale, zIndex } from "@/design-system";

export interface AppContainerProps {
  children: ReactNode;
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  contentStyle?: ViewStyle;
  /** Remove horizontal gutter for edge-to-edge hero. */
  fullBleed?: boolean;
}

export const AppContainer = memo(function AppContainer({
  children,
  scroll = true,
  scrollProps,
  contentStyle,
  fullBleed = false,
}: AppContainerProps) {
  const { colors } = useTheme();
  const pad = fullBleed ? 0 : safeArea.horizontal;

  const inner = (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {scroll ? (
        <KeyboardScrollView
          bottomOffset={spacing.xl}
          contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: spacing["6xl"], ...contentStyle }}
          {...scrollProps}
        >
          {children}
        </KeyboardScrollView>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: pad, ...contentStyle }}>{children}</View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
      {inner}
    </SafeAreaView>
  );
});

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Show back button. */
  showBack?: boolean;
  right?: ReactNode;
  /** Large hero header style. */
  large?: boolean;
}

export const AppHeader = memo(function AppHeader({
  title,
  subtitle,
  onBack,
  showBack = false,
  right,
  large = false,
}: AppHeaderProps) {
  const { colors } = useTheme();
  const t = large ? typeScale.title : typeScale.subtitle;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        minHeight: large ? 56 : 52,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        zIndex: zIndex.header,
        backgroundColor: colors.background,
      }}
    >
      {showBack && (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: -spacing.sm,
            marginRight: spacing.sm,
          }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={{
            fontSize: t.fontSize,
            lineHeight: t.lineHeight,
            fontWeight: t.fontWeight,
            letterSpacing: t.letterSpacing,
            color: colors.text,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={{ fontSize: 12, lineHeight: 16, color: colors.textMuted, fontWeight: "500", marginTop: 1 }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={{ minHeight: 44, justifyContent: "center" }}>{right}</View> : null}
    </View>
  );
});