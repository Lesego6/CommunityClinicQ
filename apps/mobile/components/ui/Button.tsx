import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  /** Button label text */
  label: string;
  /** Variant style */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is loading */
  loading?: boolean;
  /** Whether button should be full width */
  fullWidth?: boolean;
  /** Left icon/element */
  leftIcon?: React.ReactNode;
  /** Right icon/element */
  rightIcon?: React.ReactNode;
  /** Callback when pressed */
  onPress?: () => void;
  /** Custom style */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      backgroundColor: Colors.primary,
      color: Colors.white,
    },
    secondary: {
      backgroundColor: Colors.secondary,
      color: Colors.white,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: Colors.primary,
      color: Colors.primary,
    },
    ghost: {
      backgroundColor: "transparent",
      color: Colors.primary,
    },
    danger: {
      backgroundColor: Colors.danger,
      color: Colors.white,
    },
  };

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 },
    md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 },
    lg: { paddingVertical: 16, paddingHorizontal: 20, fontSize: 16 },
  };

  const variant_ = variantStyles[variant];
  const size_ = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          backgroundColor: variant_.backgroundColor,
          borderWidth: variant_.borderWidth || 0,
          borderColor: variant_.borderColor,
          opacity: isDisabled ? 0.6 : 1,
          width: fullWidth ? "100%" : "auto",
          paddingVertical: size_.paddingVertical,
          paddingHorizontal: size_.paddingHorizontal,
          shadowOpacity: variant === "primary" ? 0.3 : 0,
          shadowColor: Colors.primary,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={accessibilityLabel || label}
    >
      <View style={styles.content}>
        {loading && <ActivityIndicator color={variant_.color} size="small" />}
        {!loading && leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <Text
          style={[
            styles.label,
            {
              fontSize: size_.fontSize,
              color: variant_.color,
              fontWeight: variant === "ghost" ? "500" : "700",
              marginLeft: leftIcon && !loading ? 8 : 0,
              marginRight: rightIcon ? 8 : 0,
            },
          ]}
        >
          {label}
        </Text>

        {!loading && rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
  icon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
