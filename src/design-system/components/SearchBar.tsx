/**
 * SearchBar — Design System.
 */
import { memo, useState } from "react";
import { View, TextInput, Pressable, type TextInputProps, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/design-system/theme";
import { radius, spacing } from "@/design-system";

export interface SearchBarProps extends Omit<TextInputProps, "style"> {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  onClear?: () => void;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  style,
  onClear,
  ...rest
}: SearchBarProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.full,
          borderWidth: 1.5,
          borderColor: focused ? colors.brand : colors.border,
          backgroundColor: colors.surfaceSubtle,
        },
        style,
      ]}
    >
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <TextInput
        style={{
          flex: 1,
          marginLeft: spacing.sm + 2,
          fontSize: 15,
          lineHeight: 20,
          color: colors.text,
          paddingVertical: 0,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityRole="search"
        {...rest}
      />
      {value ? (
        <Pressable
          onPress={() => {
            onChangeText?.("");
            onClear?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          style={{ padding: spacing.xs }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
});