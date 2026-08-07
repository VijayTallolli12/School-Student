/**
 * AttendanceCard — Design System. Streak-style attendance snapshot.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import { ProgressBar } from "./Progress";

export interface AttendanceSnapshot {
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

function statusColor(pct: number, success: string, warning: string, error: string): string {
  return pct >= 75 ? success : pct >= 50 ? warning : error;
}

export const AttendanceCard = memo(function AttendanceCard({
  snapshot,
}: {
  snapshot: AttendanceSnapshot;
}) {
  const { colors } = useTheme();
  const pct = Math.min(100, Math.round(snapshot.percentage ?? 0));
  const statusC = statusColor(pct, colors.success, colors.warning, colors.error);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.lg,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>Attendance</Text>
            <View
              style={{
                marginLeft: spacing.sm,
                backgroundColor: statusC,
                borderRadius: radius.full,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF", lineHeight: 16 }}>{pct}%</Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 2 }}>
            {snapshot.present} present · {snapshot.absent} absent · {snapshot.late} late
          </Text>
        </View>
        <View style={{ flexShrink: 0, marginLeft: spacing.lg, width: "26%", minWidth: 72, maxWidth: 120 }}>
          <ProgressBar value={pct / 100} color={statusC} height={8} />
        </View>
      </View>
    </View>
  );
});