import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../constants/colors";

export type CardVariant = "elevated" | "outlined" | "flat";

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card variant style */
  variant?: CardVariant;
  /** Whether to add padding */
  padded?: boolean;
  /** Custom padding amount */
  padding?: number;
  /** Custom style */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Card({
  children,
  variant = "elevated",
  padded = true,
  padding = 16,
  style,
  accessibilityLabel,
}: CardProps) {
  const variantStyles = {
    elevated: {
      backgroundColor: Colors.white,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    outlined: {
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    flat: {
      backgroundColor: Colors.surface,
      borderWidth: 0,
    },
  };

  return (
    <View
      style={[
        styles.card,
        variantStyles[variant],
        padded && { padding },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
});
