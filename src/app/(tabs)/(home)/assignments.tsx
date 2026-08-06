import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { OfflineState } from "@/components/ui/OfflineState";
import { fetchAssignments, getErrorMessage } from "@/services/api";
import type { AssignmentItem } from "@/types";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AssignmentsScreen() {
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError(null);
      const result = await fetchAssignments(studentUuid);
      setAssignments(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAssignments();
  }, [loadAssignments]);

  const openAttachment = useCallback(async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch {
      // Ignore attachment open failures.
    }
  }, []);

  const sorted = [...assignments].sort((a, b) => new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime());

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="bg-white px-5 pt-3 pb-3 border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8 items-center justify-center -ml-1 mr-2"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#475569" />
          </TouchableOpacity>
          <Text className="text-slate-900 text-lg font-bold tracking-tight">Assignments</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />}
      >
        {loading ? (
          <View className="items-center justify-center pt-24">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">Loading assignments...</Text>
          </View>
        ) : error ? (
          <OfflineState message={error} onRetry={onRefresh} />
        ) : sorted.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="No Assignments"
            description="Assignments will appear here after teachers publish them."
          />
        ) : (
          <View className="gap-3 mb-8">
            {sorted.map((assignment) => (
              <Card key={assignment.id} padding="lg">
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="text-slate-900 text-sm font-bold flex-1 mr-3">{assignment.title}</Text>
                  <Text className="text-slate-400 text-xs">{assignment.subject_name ?? "General"}</Text>
                </View>
                {assignment.description ? (
                  <Text className="text-slate-600 text-sm leading-5">{assignment.description}</Text>
                ) : null}
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <Text className="text-slate-500 text-xs">Assigned: {formatDate(assignment.assigned_date)}</Text>
                  <Text className="text-slate-500 text-xs">Due: {assignment.due_date ? formatDate(assignment.due_date) : "—"}</Text>
                </View>
                {assignment.attachment_url ? (
                  <TouchableOpacity
                    className="mt-3 flex-row items-center self-start bg-indigo-50 px-3 py-2 rounded-lg"
                    activeOpacity={0.7}
                    onPress={() => openAttachment(assignment.attachment_url as string)}
                  >
                    <Ionicons name="attach-outline" size={16} color="#4F46E5" />
                    <Text className="text-indigo-700 text-xs font-semibold ml-1.5">Open Attachment</Text>
                  </TouchableOpacity>
                ) : null}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
