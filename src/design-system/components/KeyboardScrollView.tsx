/**
 * KeyboardScrollView — Design System.
 * Keyboard-aware scroll container built exclusively from React Native primitives:
 * `KeyboardAvoidingView` (iOS padding) + `ScrollView` (`keyboardShouldPersistTaps`,
 * drag/interactive dismiss). On iOS it additionally scrolls the focused field above
 * the keyboard using `Keyboard` events + `measureInWindow`; on Android the default
 * `adjustResize` window behavior keeps the field visible natively.
 *
 * Child `Input`s register themselves on focus via `useRegisterFocusedInput()`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
  type TextInput,
} from "react-native";

type RegisterInput = (ref: TextInput | null) => void;

const KeyboardScrollContext = createContext<RegisterInput>(() => {});

/** Called by a `TextInput` on focus so the scroll container can bring it into view. */
export function useRegisterFocusedInput(): RegisterInput {
  return useContext(KeyboardScrollContext);
}

export interface KeyboardScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  /** Gap between the focused field and the top of the keyboard. Default 16. */
  bottomOffset?: number;
}

export function KeyboardScrollView({
  children,
  bottomOffset = 16,
  ...scrollProps
}: KeyboardScrollViewProps) {
  const scrollRef = useRef<ScrollView>(null);
  const keyboardHeightRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const focusedInputRef = useRef<TextInput | null>(null);

  const scrollFocusedInputIntoView = useCallback(() => {
    const input = focusedInputRef.current;
    const scroller = scrollRef.current;
    if (!input || !scroller) return;
    if (Platform.OS !== "ios") return; // Android adjustResize keeps the field visible natively

    const keyboardHeight = keyboardHeightRef.current;
    if (keyboardHeight <= 0) return;

    input.measureInWindow((_x, windowY, _width, height) => {
      const screenHeight = Dimensions.get("window").height;
      const visibleBottom = screenHeight - keyboardHeight - bottomOffset;
      const fieldBottom = windowY + height;
      if (fieldBottom > visibleBottom) {
        const overflow = fieldBottom - visibleBottom;
        const target = Math.max(scrollOffsetRef.current + overflow, 0);
        scroller.scrollTo({ y: target, animated: true });
      }
    });
  }, [bottomOffset]);

  const registerInput = useCallback<RegisterInput>(
    (ref) => {
      focusedInputRef.current = ref;
      if (ref && keyboardHeightRef.current > 0) {
        requestAnimationFrame(scrollFocusedInputIntoView);
      }
    },
    [scrollFocusedInputIntoView],
  );

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      keyboardHeightRef.current = e.endCoordinates.height;
      scrollFocusedInputIntoView();
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      keyboardHeightRef.current = 0;
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [scrollFocusedInputIntoView]);

  const contextValue = useMemo(() => registerInput, [registerInput]);

  const { onScroll: userOnScroll, ...restProps } = scrollProps;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
      userOnScroll?.(e);
    },
    [userOnScroll],
  );

  return (
    <KeyboardScrollContext.Provider value={contextValue}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          {...restProps}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </KeyboardScrollContext.Provider>
  );
}
