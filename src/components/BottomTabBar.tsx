/**
 * BottomTabBar — Design System. Premium tab bar with an active "pill" treatment,
 * token colors, and proper safe-area + accessibility support.
 */
import { View, Text, Pressable, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { spacing, radius } from "@/design-system";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ICONS: Record<
  string,
  { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }
> = {
  "(home)": { focused: "home", default: "home-outline" },
  profile: { focused: "person", default: "person-outline" },
};

export function BottomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={{
        paddingBottom: Math.max(insets.bottom, spacing.xs),
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        shadowColor: "#131022",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View style={{ flexDirection: "row", height: 62 }}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name];
          if (!icons) return null;

          const iconName = isFocused ? icons.focused : icons.default;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const tint = isFocused ? colors.brand : colors.textTertiary;
          const row: StyleProp<ViewStyle> = {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 48,
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              hitSlop={4}
              style={row}
            >
              <View
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.full,
                  backgroundColor: isFocused ? `${colors.brand}14` : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ translateY: isFocused ? -1 : 0 }],
                  minWidth: 64,
                }}
              >
                <Ionicons name={iconName} size={22} color={tint} />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  lineHeight: 14,
                  fontWeight: isFocused ? "700" : "500",
                  color: tint,
                  marginTop: 3,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}