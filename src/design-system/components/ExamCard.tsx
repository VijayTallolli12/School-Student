/**
 * ExamCard & ExamResultCard — Design System.
 */
import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import { ProgressBar } from "./Progress";
import type { ExamResultRecord } from "@/types";

function gradeColor(grade: string | null, colors: Record<string, string>): string {
  if (!grade) return colors.brand;
  const g = grade.toUpperCase();
  if (g.startsWith("A")) return colors.success;
  if (g.startsWith("B")) return colors.info;
  if (g.startsWith("C")) return colors.warning;
  return colors.error;
}

export const ExamResultCard = memo(function ExamResultCard({ record }: { record: ExamResultRecord }) {
  const { colors } = useTheme();
  const subject = record.subject_name ?? record.subject ?? "Subject";
  const pct = record.percentage ?? (record.maximum_marks > 0 ? Math.round((record.marks_obtained / record.maximum_marks) * 100) : 0);
  const gColor = gradeColor(record.grade, colors as Record<string, string>);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        padding: spacing.md,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
            {subject}
          </Text>
          <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSecondary, marginTop: 1 }}>
            {record.marks_obtained} / {record.maximum_marks} marks
          </Text>
        </View>
        {record.grade ? (
          <View
            style={{
              backgroundColor: `${gColor}1A`,
              borderRadius: radius.sm,
              paddingHorizontal: 10,
              paddingVertical: 3,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "800", color: gColor, lineHeight: 19 }}>{record.grade}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ marginTop: spacing.md }}>
        <ProgressBar value={pct / 100} color={gColor} height={6} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
          <Text style={{ fontSize: 11, color: colors.textTertiary, lineHeight: 15 }}>Score</Text>
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.text, lineHeight: 15 }}>{pct}%</Text>
        </View>
      </View>
    </View>
  );
});

export interface ExamSectionProps {
  title: string;
  records: ExamResultRecord[];
}

export const ExamSection = memo(function ExamSection({ title, records }: ExamSectionProps) {
  const { colors } = useTheme();
  if (!records.length) return null;
  return (
    <View style={{ marginBottom: spacing.xl }}>
      <Text style={{ ...typeScale.sectionTitle, color: colors.text, marginBottom: spacing.md }}>{title}</Text>
      <View style={{ gap: spacing.md }}>
        {records.map((r) => (
          <ExamResultCard key={r.id} record={r} />
        ))}
      </View>
    </View>
  );
});