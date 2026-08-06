import { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import { useTheme, spacing } from "@/design-system";
import { AppContainer, AppHeader, Badge, Button, CircularCard, EmptyState, ErrorState, FadeInView } from "@/design-system/components";
import { fetchCirculars, getErrorMessage } from "@/services/api";
import type { CircularItem } from "@/types";

export default function CircularsScreen() {
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { colors } = useTheme();

  const loadCirculars = useCallback(async (page = 1, append = false) => {
    try {
      setError(null);
      const result = await fetchCirculars(page);
      if (append) {
        setCirculars((prev) => [...prev, ...result.data]);
      } else {
        setCirculars(result.data);
      }
      setMeta(result.meta);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadCirculars();
  }, [loadCirculars]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCirculars();
  }, [loadCirculars]);

  const handleLoadMore = useCallback(async () => {
    if (!meta || meta.current_page >= meta.last_page || loadingMore) return;
    setLoadingMore(true);
    await loadCirculars(meta.current_page + 1, true);
  }, [meta, loadingMore, loadCirculars]);

  const handleOpen = useCallback((item: CircularItem) => {
    router.push({
      pathname: "/circulars/[id]",
      params: {
        id: String(item.id),
        title: item.title ?? "",
        body: item.body ?? item.message ?? "",
        priority: item.priority ?? "normal",
        is_read: String(!!item.is_read),
        created_at: item.created_at ?? "",
        created_by: JSON.stringify(item.created_by ?? {}),
      },
    });
  }, []);

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
        onMomentumScrollEnd: (e) => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 100) {
            handleLoadMore();
          }
        },
      }}
    >
      <AppHeader
        title="Circulars"
        showBack
        onBack={() => router.back()}
        right={meta ? <Badge count={meta.total} tone="brand" /> : undefined}
      />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 96 }}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={{ color: colors.textSecondary, marginTop: spacing.md, fontSize: 14 }}>Loading circulars...</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : circulars.length === 0 ? (
        <EmptyState
          icon="megaphone-outline"
          title="No Circulars"
          description="School circulars and announcements will appear here"
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          {circulars.map((item, index) => (
            <FadeInView key={item.id} index={Math.min(index, 5)}>
              <CircularCard item={item} onPress={() => handleOpen(item)} />
            </FadeInView>
          ))}

          {loadingMore && (
            <View style={{ paddingVertical: spacing.lg, alignItems: "center" }}>
              <ActivityIndicator size="small" color={colors.brand} />
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: spacing.sm }}>Loading more...</Text>
            </View>
          )}

          {meta && meta.current_page < meta.last_page && !loadingMore && (
            <Button title="Load More" variant="ghost" size="sm" onPress={handleLoadMore} />
          )}
        </View>
      )}
    </AppContainer>
  );
}
