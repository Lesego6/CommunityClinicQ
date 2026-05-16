import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Colors } from "../../constants/colors";

export type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  /** Badge label text */
  label: string;
  /** Badge variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: "sm" | "md" | "lg";
  /** Whether badge shows a dot */
  dot?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
}

export function Badge({
  label,
  variant = "primary",
  size = "md",
  dot = false,
  style,
  labelStyle,
}: BadgeProps) {
  const variantColors = {
    primary: { bg: Colors.primaryLight, text: Colors.primary },
    secondary: { bg: Colors.secondaryLight, text: Colors.secondary },
    success: { bg: Colors.primaryLight, text: Colors.success },
    warning: { bg: Colors.yellowLight, text: Colors.warning },
    danger: { bg: Colors.redLight, text: Colors.danger },
    info: { bg: Colors.blueLight, text: Colors.blue },
  };

  const sizeStyles = {
    sm: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 4 },
    md: { fontSize: 12, paddingHorizontal: 10, paddingVertical: 6 },
    lg: { fontSize: 13, paddingHorizontal: 12, paddingVertical: 8 },
  };

  const variant_ = variantColors[variant];
  const size_ = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variant_.bg,
          paddingHorizontal: size_.paddingHorizontal,
          paddingVertical: size_.paddingVertical,
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: variant_.text },
          ]}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            fontSize: size_.fontSize,
            color: variant_.text,
            fontWeight: size === "lg" ? "600" : "500",
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  /** Alert title */
  title?: string;
  /** Alert message */
  message: string;
  /** Alert variant */
  variant?: AlertVariant;
  /** Left icon */
  icon?: React.ReactNode;
  /** Callback for close button */
  onClose?: () => void;
  /** Custom container style */
  style?: ViewStyle;
}

export function Alert({
  title,
  message,
  variant = "info",
  icon,
  onClose,
  style,
}: AlertProps) {
  const variantColors = {
    info: { bg: Colors.blueLight, border: Colors.blue, text: Colors.blue },
    success: { bg: Colors.primaryLight, border: Colors.success, text: Colors.success },
    warning: { bg: Colors.yellowLight, border: Colors.warning, text: Colors.warning },
    error: { bg: Colors.redLight, border: Colors.danger, text: Colors.danger },
  };

  const variant_ = variantColors[variant];

  return (
    <View
      style={[
        styles.alert,
        {
          backgroundColor: variant_.bg,
          borderColor: variant_.border,
        },
        style,
      ]}
      role="alert"
    >
      {icon && <View style={styles.alertIcon}>{icon}</View>}

      <View style={styles.alertContent}>
        {title && (
          <Text
            style={[
              styles.alertTitle,
              { color: variant_.text },
            ]}
          >
            {title}
          </Text>
        )}
        <Text
          style={[
            styles.alertMessage,
            { color: variant_.text },
          ]}
        >
          {message}
        </Text>
      </View>

      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.alertClose}>
          <Text style={{ color: variant_.text, fontSize: 18 }}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

import { TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontWeight: "600",
  },

  // Alert
  alert: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  alertIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertClose: {
    padding: 4,
  },
});
