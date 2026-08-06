/**
 * ErrorState + RetryView — Design System. Friendly, actionable failures.
 */
import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
}

export const ErrorState = memo(function ErrorState({
  title = "Hmm, that didn't work",
  message = "Check your connection and give it another try.",
  onRetry,
  retryLabel = "Try Again",
  compact = false,
}: ErrorStateProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: compact ? spacing["3xl"] : spacing["5xl"],
        paddingHorizontal: spacing["2xl"],
      }}
    >
      <View
        style={{
          width: compact ? 56 : 72,
          height: compact ? 56 : 72,
          borderRadius: radius.full,
          backgroundColor: `${colors.error}14`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="cloud-offline" size={compact ? 26 : 34} color={colors.error} />
      </View>
      <Text
        accessibilityRole="header"
        style={{ ...typeScale.subtitle, color: colors.text, marginTop: spacing.lg, textAlign: "center" }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: typeScale.bodySm.fontSize,
          lineHeight: typeScale.bodySm.lineHeight,
          color: colors.textSecondary,
          textAlign: "center",
          marginTop: spacing.sm,
          maxWidth: 280,
        }}
      >
        {message}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          style={{
            marginTop: spacing["2xl"],
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.brand,
            paddingHorizontal: spacing["2xl"],
            height: 44,
            borderRadius: radius.md,
          }}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: spacing.sm }} />
          <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 15, lineHeight: 20 }}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
});

/** RetryView — slim inline retry row for partial failures. */
export const RetryView = memo(function RetryView({ onRetry }: { onRetry: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onRetry}
      accessibilityRole="button"
      accessibilityLabel="Retry"
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.md,
      }}
    >
      <Ionicons name="refresh" size={16} color={colors.brand} style={{ marginRight: spacing.sm }} />
      <Text style={{ color: colors.brand, fontWeight: "600", fontSize: 14 }}>Tap to retry</Text>
    </Pressable>
  );
});