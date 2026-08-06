/**
 * FeeCard & FeeSummaryCard — Design System.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import { ProgressRing } from "./Progress";
import type { StudentFee, FeeItem } from "@/types";

function fmt(n: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);
}

function statusColor(status: string, colors: Record<string, string>): string {
  if (status === "paid") return colors.success;
  if (status === "partial") return colors.warning;
  return colors.error;
}

function statusLabel(status: string): string {
  if (status === "paid") return "Paid";
  if (status === "partial") return "Partial";
  return "Pending";
}

export const FeeSummaryCard = memo(function FeeSummaryCard({ fee }: { fee: StudentFee }) {
  const { colors } = useTheme();
  const pct = fee.total_amount > 0 ? fee.total_paid / fee.total_amount : 0;
  const sc = statusColor(fee.status, colors as Record<string, string>);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <ProgressRing value={pct} size={64} strokeWidth={7} color={sc} label={`${Math.round(pct * 100)}%`} />
      <View style={{ flex: 1, marginLeft: spacing.lg }}>
        <Text style={{ ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
          Fee Summary
        </Text>
        <Text style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 2 }}>
          ₹{fmt(fee.total_paid)} paid of ₹{fmt(fee.total_amount)}
        </Text>
        <View
          style={{
            alignSelf: "flex-start",
            marginTop: spacing.sm,
            backgroundColor: `${sc}1A`,
            borderRadius: radius.full,
            paddingHorizontal: 10,
            paddingVertical: 3,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "700", color: sc, lineHeight: 16 }}>{statusLabel(fee.status)}</Text>
        </View>
      </View>
    </View>
  );
});

export const FeeItemCard = memo(function FeeItemCard({ item }: { item: FeeItem }) {
  const { colors } = useTheme();
  const sc = statusColor(item.status, colors as Record<string, string>);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.md,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.sm,
          backgroundColor: `${sc}1A`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={item.status === "paid" ? "checkmark" : item.status === "partial" ? "time" : "alert"} size={20} color={sc} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={{ ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
          {item.fee_category ?? "Fee"}
        </Text>
        <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSecondary, marginTop: 1 }}>
          {item.due_date ? `Due ${item.due_date}` : "—"}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>₹{fmt(item.amount)}</Text>
        {item.balance > 0 ? (
          <Text style={{ fontSize: 12, fontWeight: "600", color: sc, lineHeight: 16 }}>Balance ₹{fmt(item.balance)}</Text>
        ) : (
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.success, lineHeight: 16 }}>Cleared</Text>
        )}
      </View>
    </View>
  );
});