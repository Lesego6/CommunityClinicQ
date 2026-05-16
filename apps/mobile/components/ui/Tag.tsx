import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "../../constants/colors";

interface TagProps {
  /** Tag label */
  label: string;
  /** Tag variant */
  variant?: "filled" | "outlined";
  /** Tag color */
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  /** Whether tag is removable */
  removable?: boolean;
  /** Callback when remove is pressed */
  onRemove?: () => void;
  /** Tag size */
  size?: "sm" | "md";
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
}

export function Tag({
  label,
  variant = "filled",
  color = "primary",
  removable = false,
  onRemove,
  size = "md",
  leftIcon,
  style,
  labelStyle,
}: TagProps) {
  const colorMap = {
    primary: { bg: Colors.primaryLight, text: Colors.primary, border: Colors.primary },
    secondary: { bg: Colors.secondaryLight, text: Colors.secondary, border: Colors.secondary },
    success: { bg: Colors.primaryLight, text: Colors.success, border: Colors.success },
    warning: { bg: Colors.yellowLight, text: Colors.warning, border: Colors.warning },
    danger: { bg: Colors.redLight, text: Colors.danger, border: Colors.danger },
  };

  const sizeStyles = {
    sm: { fontSize: 11, paddingHorizontal: 10, paddingVertical: 4 },
    md: { fontSize: 12, paddingHorizontal: 12, paddingVertical: 6 },
  };

  const color_ = colorMap[color];
  const size_ = sizeStyles[size];

  const bgColor = variant === "filled" ? color_.bg : Colors.white;
  const borderColor = variant === "outlined" ? color_.border : "transparent";

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          paddingHorizontal: size_.paddingHorizontal,
          paddingVertical: size_.paddingVertical,
        },
        style,
      ]}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <Text
        style={[
          styles.label,
          {
            fontSize: size_.fontSize,
            color: color_.text,
            fontWeight: variant === "outlined" ? "500" : "600",
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>

      {removable && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <Text style={[styles.removeText, { color: color_.text }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  leftIcon: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "600",
  },
  removeButton: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  removeText: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
});
