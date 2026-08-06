import { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { fetchTimetable, getErrorMessage } from "@/services/api";
import type { TimetableSlot, TimetableData } from "@/types";
import { useTheme, spacing, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, Chip, EmptyState, ErrorState, Tag, FadeInView } from "@/design-system/components";

const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBR = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getColor(name: string, colors: Record<string, string>): string {
  const subjectMap: Record<string, string> = {
    Mathematics: colors.brand,
    Science: colors.success,
    English: colors.accent,
    Hindi: colors.warning,
    "Social Studies": colors.secondary,
    "Physical Education": colors.info,
    "Computer Science": colors.brandDeep,
    Art: colors.error,
    "General Knowledge": colors.info,
  };
  if (subjectMap[name]) return subjectMap[name];
  const fallback = [colors.brand, colors.success, colors.secondary, colors.warning, colors.accent, colors.info, colors.brandDeep, colors.error];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return fallback[Math.abs(hash) % fallback.length];
}

function formatTime(timeStr: string): string {
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  const m = parts[1] ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

function formatTimeRange(start: string, end: string): string {
  const sHour = parseInt(start.split(":")[0], 10);
  const eHour = parseInt(end.split(":")[0], 10);
  const sAmPm = sHour >= 12 ? "PM" : "AM";
  const eAmPm = eHour >= 12 ? "PM" : "AM";

  const sFormatted = formatTime(start);
  const eFormatted = formatTime(end);

  if (sAmPm === eAmPm) {
    const sShort = sFormatted.replace(` ${sAmPm}`, "");
    return `${sShort} – ${eFormatted}`;
  }
  return `${sFormatted} – ${eFormatted}`;
}

function isCurrentSlot(slot: TimetableSlot): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startParts = slot.start_time.split(":");
  const endParts = slot.end_time.split(":");
  const startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1] ?? "0", 10);
  const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1] ?? "0", 10);
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

export default function TimetableScreen() {
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const [timetable, setTimetable] = useState<TimetableData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayDow = new Date().getDay();
  const defaultDay = todayDow >= 1 && todayDow <= 7 ? DAY_NAMES[todayDow] : "Monday";
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const loadTimetable = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const data = await fetchTimetable(studentUuid);
      setTimetable(data.timetable ?? {});
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTimetable();
  }, [loadTimetable]);

  const dayNumbers = useMemo(() => Object.keys(timetable).map(Number).sort(), [timetable]);
  const dayList = useMemo(
    () =>
      dayNumbers.map((d) => ({
        number: d,
        name: DAY_NAMES[d] ?? `Day ${d}`,
        abbr: DAY_ABBR[d] ?? `${d}`,
      })),
    [dayNumbers],
  );

  const dayKey = useMemo(
    () => String(dayNumbers.find((d) => DAY_NAMES[d] === selectedDay) ?? ""),
    [dayNumbers, selectedDay],
  );
  const daySlots = useMemo(() => {
    const slots = dayKey ? (timetable[dayKey] ?? []) : [];
    return [...slots].sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [timetable, dayKey]);

  const currentSlotIds = useMemo(() => {
    const ids = new Set<number>();
    for (const slot of daySlots) {
      if (isCurrentSlot(slot)) ids.add(slot.id);
    }
    return ids;
  }, [daySlots]);

  const { colors } = useTheme();

  const renderDayTabs = () => {
    if (dayList.length === 0) return null;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.md }}>
        {dayList.map((day) => (
          <Chip key={day.number} label={day.abbr} selected={selectedDay === day.name} onPress={() => setSelectedDay(day.name)} />
        ))}
      </ScrollView>
    );
  };

  const renderSlotCard = (slot: TimetableSlot, index: number) => {
    const subjectName = slot.subject?.name ?? "—";
    const teacherName = slot.teacher?.name ?? "";
    const color = getColor(subjectName, colors as Record<string, string>);
    const isCurrent = currentSlotIds.has(slot.id);

    return (
      <FadeInView key={slot.id ?? index} index={Math.min(index, 5)}>
        <View style={{ flexDirection: "row", marginBottom: spacing.md }}>
          <View style={{ width: 52, paddingTop: spacing.xs, flexShrink: 0 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textMuted, lineHeight: 14 }}>
              {formatTime(slot.start_time)}
            </Text>
          </View>

          <View style={{ alignItems: "center", marginHorizontal: spacing.sm, flexShrink: 0 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: 6, backgroundColor: isCurrent ? color : colors.border }} />
            {index < daySlots.length - 1 && (
              <View style={{ width: 1, flex: 1, marginTop: 5, backgroundColor: isCurrent ? `${color}30` : colors.divider }} />
            )}
          </View>

          <TouchableOpacity style={{ flex: 1, minWidth: 0 }} activeOpacity={0.7}>
            <Card
              variant="outlined"
              padding="sm"
              style={{
                borderLeftWidth: isCurrent ? 4 : 3,
                borderLeftColor: color,
                ...(isCurrent
                  ? {
                      shadowColor: color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.15,
                      shadowRadius: 6,
                      elevation: 2,
                      backgroundColor: `${color}0D`,
                    }
                  : {}),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <Text style={{ flex: 1, ...typeScale.bodyStrong, color: colors.text, lineHeight: 18 }} numberOfLines={2}>
                      {subjectName}
                    </Text>
                    {isCurrent && <Tag label="NOW" tone="success" />}
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: spacing.xs }}>
                    {teacherName ? (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="person-outline" size={10} color={colors.textTertiary} />
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginLeft: spacing.xs, lineHeight: 14 }}>{teacherName}</Text>
                      </View>
                    ) : null}
                    {teacherName && slot.room ? (
                      <Text style={{ color: colors.textTertiary, marginHorizontal: 6, fontSize: 11 }}>•</Text>
                    ) : null}
                    {slot.room ? (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="location-outline" size={10} color={colors.textTertiary} />
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginLeft: spacing.xs, lineHeight: 14 }}>{slot.room}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textTertiary, flexShrink: 0, lineHeight: 14, marginTop: 1 }}>
                  {formatTimeRange(slot.start_time, slot.end_time)}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </FadeInView>
    );
  };

  return (
    <AppContainer
      scrollProps={{
        refreshControl: (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />
        ),
      }}
    >
      <AppHeader title="Timetable" showBack onBack={() => router.back()} />

      {renderDayTabs()}

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading timetable...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : daySlots.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No Classes Scheduled"
          description={
            dayList.length > 0
              ? "No timetable has been set up for this day"
              : "Your timetable hasn't been published yet"
          }
        />
      ) : (
        <View style={{ marginBottom: spacing["2xl"] }}>
          {daySlots.map((slot, index) => renderSlotCard(slot, index))}
        </View>
      )}
    </AppContainer>
  );
}
