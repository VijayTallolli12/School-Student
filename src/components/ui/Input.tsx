import { useState, useCallback, useRef, memo, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBrandingStore } from "@/store/branding.store";
import { useRegisterFocusedInput } from "@/design-system/components/KeyboardScrollView";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

// Static values outside component — never recomputed
const BASE_CONTAINER_CLASS = "flex-row items-center rounded-xl border px-4";
const INPUT_CLASS = "flex-1 py-3.5 text-base text-slate-900";

export const Input = memo(
  forwardRef<TextInput, InputProps>(function Input({
    label,
    error,
    leftIcon,
    isPassword,
    containerStyle,
    className = "",
    onFocus: externalOnFocus,
    onBlur: externalOnBlur,
    ...rest
  }: InputProps, ref) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const showError = !!error;
  const primaryColor = useBrandingStore((s) => s.theme.primary);
  const registerFocusedInput = useRegisterFocusedInput();

  // Single ref object that is both forwarded (programmatic focus) and used
  // internally for keyboard auto-scroll registration.
  const innerRef = useRef<TextInput | null>(null);
  const setInputRef = useCallback(
    (node: TextInput | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Ref-based callbacks — eternally stable, never cause re-renders
  const onFocusRef = useRef(externalOnFocus);
  onFocusRef.current = externalOnFocus;
  const onBlurRef = useRef(externalOnBlur);
  onBlurRef.current = externalOnBlur;

  const handleFocus = useCallback<NonNullable<TextInputProps["onFocus"]>>(
    (e) => {
      setIsFocused(true);
      registerFocusedInput(innerRef.current);
      onFocusRef.current?.(e);
    },
    [registerFocusedInput],
  );

  const handleBlur = useCallback<NonNullable<TextInputProps["onBlur"]>>((e) => {
    setIsFocused(false);
    onBlurRef.current?.(e);
  }, []);

  // Border color via inline style — avoids NativeWind className recomputation
  const borderColor = showError
    ? "#DC2626"
    : isFocused
      ? primaryColor
      : "#E2E8F0";

  const bgColor = showError ? "#FEF2F2" : isFocused ? "#FFFFFF" : "#F8FAFC";

  const iconColor = showError
    ? "#DC2626"
    : isFocused
      ? primaryColor
      : "#94A3B8";

  return (
    <View style={containerStyle}>
      {label && (
        <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
          {label}
        </Text>
      )}
      <View
        className={BASE_CONTAINER_CLASS}
        style={{ borderColor, backgroundColor: bgColor }}
      >
        {leftIcon && (
          <View className="mr-3">
            <Ionicons name={leftIcon} size={20} color={iconColor} />
          </View>
        )}
        <TextInput
          ref={setInputRef}
          className={[INPUT_CLASS, className].filter(Boolean).join(" ")}
          placeholderTextColor="#94A3B8"
          selectionColor={primaryColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="ml-2 p-1"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isFocused ? primaryColor : "#94A3B8"}
            />
          </TouchableOpacity>
        )}
      </View>
      {showError && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="alert-circle" size={14} color="#DC2626" />
          <Text className="text-status-error text-xs ml-1 font-medium">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
  }),
);
