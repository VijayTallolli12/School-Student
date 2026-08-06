import { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, RefreshControl, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { useTheme, spacing, radius, typeScale } from "@/design-system";
import { AppContainer, AppHeader, Card, Tag, Button, EmptyState, ErrorState, FadeInView } from "@/design-system/components";
import { fetchDocuments, getErrorMessage } from "@/services/api";
import type { StudentDocument } from "@/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function DocumentsScreen() {
  const students = useAuthStore((s) => s.students);
  const studentUuid = useAuthStore((s) => s.studentUuid) ?? students?.[0]?.uuid;

  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { colors } = useTheme();

  const loadDocuments = useCallback(async () => {
    if (!studentUuid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setError(null);
      const result = await fetchDocuments(studentUuid);
      setDocuments(result);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentUuid]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDocuments();
  }, [loadDocuments]);

  const handleViewDocument = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {}
  };

  const verificationSummary = {
    verified: documents.filter((d) => d.is_verified).length,
    pending: documents.filter((d) => !d.is_verified).length,
  };

  return (
    <AppContainer
      scrollProps={{
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand}
            colors={[colors.brand]}
          />
        ),
      }}
    >
      <AppHeader title="Documents" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading documents...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : documents.length === 0 ? (
        <EmptyState
          icon="folder-open-outline"
          title="No Documents"
          description="Uploaded documents will appear here once added by the school"
        />
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg }}>
            <Card padding="md" style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ ...typeScale.title, color: colors.success }}>{verificationSummary.verified}</Text>
              <Text style={{ ...typeScale.caption, color: colors.textMuted, marginTop: spacing.xs }}>Verified</Text>
            </Card>
            <Card padding="md" style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ ...typeScale.title, color: colors.warning }}>{verificationSummary.pending}</Text>
              <Text style={{ ...typeScale.caption, color: colors.textMuted, marginTop: spacing.xs }}>Pending</Text>
            </Card>
          </View>

          <View style={{ gap: spacing.md, marginBottom: spacing["2xl"] }}>
            {documents.map((doc, index) => {
              const isVerified = doc.is_verified;
              return (
                <FadeInView key={doc.id} index={Math.min(index, 5)}>
                  <Card padding="none" style={{ overflow: "hidden" }}>
                    <View style={{ padding: spacing.md }}>
                      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: radius.md,
                            backgroundColor: colors.surfaceSubtle,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: spacing.md,
                          }}
                        >
                          <Ionicons name="document-text-outline" size={22} color={colors.textSecondary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ flex: 1, ...typeScale.bodyStrong, color: colors.text }} numberOfLines={1}>
                              {doc.title}
                            </Text>
                            <Tag label={isVerified ? "Verified" : "Pending"} tone={isVerified ? "success" : "warning"} />
                          </View>

                          <Text style={{ ...typeScale.bodySm, color: colors.textSecondary, marginTop: spacing.xs }}>
                            {doc.document_type_label || doc.document_type.replace(/_/g, " ")}
                            {doc.file_size_formatted ? ` · ${doc.file_size_formatted}` : ""}
                          </Text>

                          <View style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.sm, gap: spacing.lg }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                              <Text style={{ fontSize: 12, color: colors.textTertiary, marginLeft: spacing.xs }}>
                                Uploaded: {formatDate(doc.created_at)}
                              </Text>
                            </View>
                            {doc.expiry_date && (
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="alert-circle-outline" size={12} color={colors.warning} />
                                <Text style={{ fontSize: 12, color: colors.warning, marginLeft: spacing.xs }}>
                                  Expires: {formatDate(doc.expiry_date)}
                                </Text>
                              </View>
                            )}
                          </View>

                          {doc.remarks ? (
                            <Text
                              style={{ ...typeScale.bodySm, color: colors.textTertiary, fontStyle: "italic", marginTop: spacing.sm }}
                            >
                              {doc.remarks}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>

                    {doc.download_url && (
                      <View style={{ borderTopWidth: 1, borderTopColor: colors.divider }}>
                        <Button
                          title="View Document"
                          icon="eye-outline"
                          variant="ghost"
                          size="sm"
                          onPress={() => handleViewDocument(doc.download_url!)}
                        />
                      </View>
                    )}
                  </Card>
                </FadeInView>
              );
            })}
          </View>
        </>
      )}
    </AppContainer>
  );
}