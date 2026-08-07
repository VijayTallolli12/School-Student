/**
 * Modal (bottom sheet) — Design System.
 * Slide-up sheet with scrim and drag-down-to-close gesture.
 */
import { memo, useEffect, useRef, type ReactNode } from "react";
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  Animated,
  PanResponder,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/design-system/theme";
import { spacing, radius, elevation, zIndex, motion } from "@/design-system";

const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

/** Share of the window height the sheet can use (capped for small/landscape). */
function sheetHeightFor(windowHeight: number): number {
  return Math.min(windowHeight * 0.6, 520);
}

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  disableSwipe?: boolean;
}

export const BottomSheet = memo(function BottomSheet({
  visible,
  onClose,
  title,
  children,
  disableSwipe = false,
}: BottomSheetProps) {
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sheetHeight = sheetHeightFor(windowHeight);
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const scrimOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: motion.durationBase, useNativeDriver: true }),
        Animated.timing(scrimOpacity, { toValue: 1, duration: motion.durationBase, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(translateY, { toValue: sheetHeight, duration: motion.durationFast, useNativeDriver: true }).start();
    }
  }, [visible, translateY, scrimOpacity, sheetHeight]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => !disableSwipe && g.dy > 8,
      onPanResponderMove: (_, g) => translateY.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > sheetHeight * 0.25) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 30, bounciness: 0 }).start();
        }
      },
    }),
  ).current;

  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, zIndex: zIndex.modal }}>
        <Animated.View style={[FILL, { backgroundColor: colors.overlay, opacity: scrimOpacity }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close sheet" />
        </Animated.View>

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            {...(disableSwipe ? {} : pan.panHandlers)}
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: radius["2xl"],
              borderTopRightRadius: radius["2xl"],
              maxHeight: sheetHeight,
              paddingBottom: Math.max(insets.bottom, spacing["3xl"]),
              elevation: elevation.overlay.elevation,
              shadowColor: elevation.overlay.shadowColor,
              shadowOffset: elevation.overlay.shadowOffset,
              shadowOpacity: elevation.overlay.shadowOpacity,
              shadowRadius: elevation.overlay.shadowRadius,
              transform: [{ translateY }],
            }}
          >
            <View style={{ alignItems: "center", paddingTop: spacing.md, paddingBottom: spacing.sm }}>
              <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border }} />
            </View>
            {title ? (
              <Text
                accessibilityRole="header"
                style={{ fontSize: 18, fontWeight: "700", color: colors.text, lineHeight: 24, paddingHorizontal: spacing.xl, marginBottom: spacing.md }}
              >
                {title}
              </Text>
            ) : null}
            <View style={{ paddingHorizontal: spacing.xl }}>{children}</View>
          </Animated.View>
        </View>
      </View>
    </RNModal>
  );
});