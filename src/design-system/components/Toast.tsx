/**
 * Toast — Design System. Lightweight global toast via context provider + hook.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Animated, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, type Theme } from "@/design-system/theme";
import { spacing, radius, elevation, zIndex, motion } from "@/design-system";

type ToastTone = "success" | "error" | "info" | "brand";

interface ToastOptions {
  tone?: ToastTone;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

function toneColor(theme: Theme, tone: ToastTone): string {
  switch (tone) {
    case "success": return theme.colors.success;
    case "error": return theme.colors.error;
    case "info": return theme.colors.info;
    default: return theme.colors.brand;
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const [toast, setToast] = useState<ToastItem | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: motion.durationFast, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -12, duration: motion.durationFast, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = ++idRef.current;
      const tone = options?.tone ?? "info";
      setToast({ id, message, tone });
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: motion.durationBase, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: motion.durationBase, useNativeDriver: true }),
      ]).start();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(hide, options?.duration ?? 2600);
    },
    [opacity, translateY, hide],
  );

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  const tone = toast?.tone ?? "info";
  const toneC = toneColor(theme, tone);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          pointerEvents="none"
          style={{ position: "absolute", top: 48, left: spacing.xl, right: spacing.xl, zIndex: zIndex.toast }}
        >
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.card,
              borderRadius: radius.md,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              elevation: elevation.overlay.elevation,
              shadowColor: elevation.overlay.shadowColor,
              shadowOffset: elevation.overlay.shadowOffset,
              shadowOpacity: elevation.overlay.shadowOpacity,
              shadowRadius: elevation.overlay.shadowRadius,
              opacity,
              transform: [{ translateY }],
              borderLeftWidth: 4,
              borderLeftColor: toneC,
            }}
          >
            <Ionicons name={toast.tone === "success" ? "checkmark-circle" : toast.tone === "error" ? "alert-circle" : "information-circle"} size={22} color={toneC} />
            <Text
              style={{ flex: 1, marginLeft: spacing.md, fontSize: 14, fontWeight: "600", color: theme.colors.text, lineHeight: 19 }}
              accessibilityRole="alert"
            >
              {toast.message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}