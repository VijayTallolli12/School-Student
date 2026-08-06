import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchAttendance, getErrorMessage } from "@/services/api";
import type { AttendanceRecord } from "@/types";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, StatCard, ProgressRing } from "@/design-system/components";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function statusColor(status: string | null, colors: Record<string, string>): string {
  switch (status) {
    case "present": return colors.success;
    case "absent": return colors.error;
    case "late": return colors.warning;
    case "half_day": return colors.warning;
    default: return colors.textTertiary;
  }
}

export default function AttendanceScreen() {
  const { colors } = useTheme();
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<{ total_days: number; counts: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAttendance = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const data = await fetchAttendance(studentUuid, selectedMonth, selectedYear);
      setRecords(data.records ?? []);
      setSummary(data.summary);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid, selectedMonth, selectedYear]);

  useEffect(() => {
    setLoading(true);
    loadAttendance();
  }, [loadAttendance]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAttendance();
  }, [loadAttendance]);

  const recordMap = new Map<string, AttendanceRecord>();
  records.forEach((r) => {
    const day = new Date(r.attendance_date).getDate();
    recordMap.set(String(day), r);
  });

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const rec = recordMap.get(String(dayNum));
    const isFuture = dayNum > now.getDate() && selectedMonth >= now.getMonth() + 1 && selectedYear >= now.getFullYear();
    return { date: dayNum, record: rec ?? null, isFuture };
  });

  const present = summary?.counts?.present ?? 0;
  const absent = summary?.counts?.absent ?? 0;
  const late = summary?.counts?.late ?? 0;
  const halfDay = summary?.counts?.half_day ?? 0;
  const total = summary?.total_days ?? 0;
  const percentage = total > 0 ? Math.round(((present + late + halfDay) / total) * 100) : 0;

  const getStatusIcon = (status: string | null): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case "present": return "checkmark-circle";
      case "absent": return "close-circle";
      case "late": return "time";
      case "half_day": return "remove-circle";
      default: return "ellipse-outline";
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "present": return "Present";
      case "absent": return "Absent";
      case "late": return "Late";
      case "half_day": return "Half Day";
      default: return "";
    }
  };

  const selectedRecord = selectedDay ? recordMap.get(String(selectedDay)) : null;

  const prevMonth = () => {
    setSelectedMonth((m) => {
      if (m === 1) {
        setSelectedYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
    setSelectedDay(null);
  };
  const nextMonth = () => {
    setSelectedMonth((m) => {
      if (m === 12) {
        setSelectedYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
    setSelectedDay(null);
  };

  const ringColor = percentage >= 75 ? colors.success : percentage >= 50 ? colors.warning : colors.error;

  return (
    <AppContainer
      scrollProps={{
        refreshControl: (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />
        ),
      }}
    >
      <AppHeader title="Attendance" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 14 }}>Loading attendance...</Text>
        </View>
      ) : error ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 40 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.full,
              backgroundColor: `${colors.error}1A`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="cloud-offline-outline" size={30} color={colors.error} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 8 }}>Connection Error</Text>
          <Text style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>
            {error}
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.brand,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: radius.lg,
            }}
            activeOpacity={0.7}
            onPress={onRefresh}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 14, marginLeft: 8 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl }}>
            <View style={{ flex: 1 }}>
              <StatCard label="Present" value={String(present + late + halfDay)} icon="checkmark-circle-outline" color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard label="Absent" value={String(absent)} icon="close-circle-outline" color={colors.error} />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard label="Late" value={String(late)} icon="time-outline" color={colors.warning} />
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.divider,
              padding: spacing.lg,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.xl,
            }}
          >
            <ProgressRing value={percentage / 100} size={84} strokeWidth={9} color={ringColor} label={`${percentage}%`} />
            <View style={{ flex: 1, marginLeft: spacing.xl }}>
              <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>Monthly Attendance</Text>
              <Text style={{ fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 2 }}>
                {MONTHS[selectedMonth - 1]} {selectedYear}
              </Text>
              <View
                style={{
                  alignSelf: "flex-start",
                  marginTop: spacing.sm,
                  backgroundColor: `${ringColor}1A`,
                  borderRadius: radius.full,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: ringColor, lineHeight: 16 }}>
                  {percentage >= 75 ? "Good attendance" : "Needs improvement"}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.lg, marginBottom: spacing.xl }}>
            {[
              { label: "Present", color: colors.success },
              { label: "Absent", color: colors.error },
              { label: "Late", color: colors.warning },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 6 }} />
                <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "500" }}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.divider,
              padding: spacing.md,
              marginBottom: spacing["2xl"],
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
              <TouchableOpacity
                onPress={prevMonth}
                accessibilityLabel="Previous month"
                style={{ width: 36, height: 36, backgroundColor: colors.surfaceSubtle, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>
                {MONTHS[selectedMonth - 1]} {selectedYear}
              </Text>
              <TouchableOpacity
                onPress={nextMonth}
                accessibilityLabel="Next month"
                style={{ width: 36, height: 36, backgroundColor: colors.surfaceSubtle, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", marginBottom: spacing.sm }}>
              {DAYS.map((day) => (
                <View key={day} style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}>
                  <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: "500" }}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <View key={`empty-${i}`} style={{ width: "14.28%", aspectRatio: 1, padding: 2 }} />
              ))}
              {calendarDays.map((day) => {
                const status = day.record?.status ?? (day.isFuture ? "future" : null);
                const sc = statusColor(status, colors as Record<string, string>);
                return (
                  <TouchableOpacity
                    key={day.date}
                    style={{ width: "14.28%", aspectRatio: 1, padding: 2 }}
                    onPress={() => setSelectedDay(day.date)}
                    accessibilityLabel={`${day.date} ${MONTHS[selectedMonth - 1]}, ${status ? getStatusLabel(status) : "no record"}`}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderRadius: radius.md,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: selectedDay === day.date ? 2 : 0,
                        borderColor: selectedDay === day.date ? colors.brand : "transparent",
                        opacity: day.isFuture ? 0.3 : 1,
                      }}
                    >
                      {status && status !== "future" ? (
                        <Ionicons name={getStatusIcon(status)} size={20} color={sc} />
                      ) : (
                        <Text style={{ fontSize: 12, color: day.isFuture ? colors.textTertiary : colors.textSecondary }}>
                          {day.date}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {selectedDay && (
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.divider,
                padding: spacing.md,
                marginBottom: spacing["2xl"],
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>
                {DAYS[new Date(selectedYear, selectedMonth - 1, selectedDay).getDay()]}, {selectedDay} {MONTHS[selectedMonth - 1]} {selectedYear}
              </Text>
              {selectedRecord ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radius.sm,
                      backgroundColor: `${statusColor(selectedRecord.status, colors as Record<string, string>)}1A`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: spacing.md,
                    }}
                  >
                    <Ionicons
                      name={getStatusIcon(selectedRecord.status)}
                      size={22}
                      color={statusColor(selectedRecord.status, colors as Record<string, string>)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
                      {getStatusLabel(selectedRecord.status)}
                    </Text>
                    {selectedRecord.remark ? (
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{selectedRecord.remark}</Text>
                    ) : null}
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.surfaceSubtle, alignItems: "center", justifyContent: "center", marginRight: spacing.md }}>
                    <Ionicons name="ellipse-outline" size={22} color={colors.textTertiary} />
                  </View>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>No record / Holiday</Text>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </AppContainer>
  );
}