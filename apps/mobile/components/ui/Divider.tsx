import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../constants/colors";

interface DividerProps {
  /** Divider orientation */
  orientation?: "horizontal" | "vertical";
  /** Custom color */
  color?: string;
  /** Thickness/width */
  thickness?: number;
  /** Custom style */
  style?: ViewStyle;
  /** Margin around divider */
  margin?: number;
}

export function Divider({
  orientation = "horizontal",
  color = Colors.border,
  thickness = 1,
  style,
  margin,
}: DividerProps) {
  if (orientation === "horizontal") {
    return (
      <View
        style={[
          {
            height: thickness,
            backgroundColor: color,
            marginVertical: margin,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: thickness,
          backgroundColor: color,
          marginHorizontal: margin,
        },
        style,
      ]}
    />
  );
}

interface SpacerProps {
  /** Space size */
  size?: number;
  /** Custom height */
  height?: number;
  /** Custom width */
  width?: number;
  /** Custom style */
  style?: ViewStyle;
}

export function Spacer({ size, height, width, style }: SpacerProps) {
  const space = size ?? (height || width ? 0 : 16);

  return (
    <View
      style={[
        {
          height: height ?? space,
          width: width ?? space,
        },
        style,
      ]}
    />
  );
}

interface LoadingProps {
  /** Loading size */
  size?: "sm" | "md" | "lg";
  /** Loader color */
  color?: string;
  /** Custom container style */
  style?: ViewStyle;
}

export function Loading({
  size = "md",
  color = Colors.primary,
  style,
}: LoadingProps) {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  const spinnerSize = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: spinnerSize * 1.5,
          height: spinnerSize * 1.5,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: color + "30",
            borderTopColor: color,
            borderBottomColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 100,
    borderTopWidth: 3,
  },
});
