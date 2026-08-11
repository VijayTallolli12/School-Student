import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useTheme, spacing, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, QuickActionButton } from "@/design-system/components";

const ACADEMIC_MODULES: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
  { title: "Timetable", subtitle: "Today and week schedule", icon: "time-outline", route: "/timetable" },
  { title: "Homework", subtitle: "Pending and completed", icon: "book-outline", route: "/homework" },
  { title: "Attendance", subtitle: "Monthly presence report", icon: "calendar-outline", route: "/attendance" },
  { title: "Results", subtitle: "Recent marks and grades", icon: "trophy-outline", route: "/results" },
  { title: "Announcements", subtitle: "School announcements", icon: "megaphone-outline", route: "/announcements" },
  { title: "Student Documents", subtitle: "Documents and resources", icon: "folder-open-outline", route: "/documents" },
  { title: "Exam Schedule", subtitle: "Upcoming exam dates", icon: "calendar-clear-outline", route: "/exam-schedule" },
  { title: "Assignments", subtitle: "Tasks and due dates", icon: "clipboard-outline", route: "/assignments" },
  { title: "Calendar", subtitle: "Events and holidays", icon: "calendar-number-outline", route: "/calendar" },
  { title: "Transport", subtitle: "Pickup and driver details", icon: "bus-outline", route: "/transport" },
  { title: "Leave Requests", subtitle: "Apply or track requests", icon: "document-text-outline", route: "/leave" },
];

const MODULE_COLOR: Record<string, string> = {
  "/timetable": "brand",
  "/homework": "warning",
  "/attendance": "info",
  "/results": "accent",
  "/announcements": "error",
  "/documents": "muted",
  "/exam-schedule": "accent",
  "/assignments": "secondary",
  "/calendar": "info",
  "/transport": "success",
  "/leave": "brand",
};

export default function AcademicsScreen() {
  const { colors } = useTheme();

  const resolveColor = (route: string): string => {
    const key = MODULE_COLOR[route];
    if (key === "brand") return colors.brand;
    if (key === "secondary") return colors.secondary;
    if (key === "accent") return colors.accent;
    if (key === "success") return colors.success;
    if (key === "warning") return colors.warning;
    if (key === "error") return colors.error;
    if (key === "info") return colors.info;
    return colors.textSecondary;
  };

  return (
    <AppContainer>
      <AppHeader title="Academics" subtitle="Everything needed for your school day" />

      <Card padding="lg" style={{ marginBottom: spacing.md }}>
        <Text style={{ ...typeScale.bodyStrong, color: colors.text }}>Today&apos;s Focus</Text>
        <Text style={{ ...typeScale.bodySm, color: colors.textSecondary, marginTop: spacing.xs, lineHeight: 20 }}>
          Check timetable first, complete due homework, then review upcoming exams.
        </Text>
      </Card>

      {Array.from({ length: Math.ceil(ACADEMIC_MODULES.length / 2) }).map((_, rowIndex) => {
        const items = ACADEMIC_MODULES.slice(rowIndex * 2, rowIndex * 2 + 2);
        return (
          <View key={rowIndex} style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.md }}>
            {items.map((module) => (
              <QuickActionButton
                key={module.title}
                label={module.title}
                icon={module.icon}
                color={resolveColor(module.route)}
                onPress={() => router.push(module.route as Href)}
              />
            ))}
            {items.length === 1 ? <View style={{ flex: 1 }} /> : null}
          </View>
        );
      })}
    </AppContainer>
  );
}