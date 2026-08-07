/**
 * Grid — Design System. Responsive equal-width grid.
 * Measures its own width and lays children into adaptive columns so cards
 * never clip on small phones and expand gracefully on tablets (3–4 columns).
 */
import { memo, useCallback, useState, Children, type ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { spacing } from "@/design-system/spacing";

export interface GridProps {
  columns?: number;
  /** Horizontal + vertical gap between cells. */
  gap?: number;
  style?: ViewStyle;
  cellStyle?: ViewStyle;
  children: ReactNode;
}

export const Grid = memo(function Grid({
  columns = 2,
  gap = spacing.md,
  style,
  cellStyle,
  children,
}: GridProps) {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback(
    (e: { nativeEvent?: { layout?: { width?: number } } | null }) => {
      const width = e?.nativeEvent?.layout?.width ?? 0;
      setWidth((prev) => (prev === width ? prev : width));
    },
    [],
  );

  const items = Children.toArray(children);
  const cellWidth = width > 0 ? Math.max(0, (width - gap * (columns - 1)) / columns) : 0;

  return (
    <View
      onLayout={onLayout}
      style={[{ flexDirection: "row", flexWrap: "wrap", gap }, style]}
    >
      {items.map((child, index) => (
        <View
          key={index}
          style={[
            {
              width: cellWidth > 0 ? cellWidth : `${100 / columns}%`,
              minWidth: 0,
            },
            cellStyle,
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
});