import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="academics" />
      <Stack.Screen name="student-profile" />
      <Stack.Screen name="fees" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="notifications/index" />
      <Stack.Screen name="notifications/[id]" />
      <Stack.Screen name="timetable" />
      <Stack.Screen name="results" />
      <Stack.Screen name="exam-schedule" />
      <Stack.Screen name="assignments" />
      <Stack.Screen name="homework" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="announcements" />
      <Stack.Screen name="announcements/[id]" />
      <Stack.Screen name="leave" />
      <Stack.Screen name="leave/apply" />
      <Stack.Screen name="leave/[id]" />
      <Stack.Screen name="transport/index" />
      <Stack.Screen name="transport/driver" />
      <Stack.Screen name="transport/route" />
    </Stack>
  );
}
