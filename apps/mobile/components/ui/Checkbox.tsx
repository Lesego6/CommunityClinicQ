import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Colors } from "../../constants/colors";

interface CheckboxProps {
  /** Whether checkbox is checked */
  checked: boolean;
  /** Callback when checkbox is toggled */
  onToggle: (checked: boolean) => void;
  /** Checkbox label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Whether checkbox is disabled */
  disabled?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
  /** Checkbox size */
  size?: "sm" | "md" | "lg";
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Checkbox({
  checked,
  onToggle,
  label,
  helperText,
  disabled = false,
  containerStyle,
  labelStyle,
  size = "md",
  accessibilityLabel,
}: CheckboxProps) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const checkboxSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => !disabled && onToggle(!checked)}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel || label}
    >
      <View style={styles.checkboxWrapper}>
        <View
          style={[
            styles.checkbox,
            {
              width: checkboxSize,
              height: checkboxSize,
              borderRadius: checkboxSize / 4,
            },
            checked && styles.checkboxChecked,
            disabled && styles.checkboxDisabled,
          ]}
        >
          {checked && (
            <Svg width={checkboxSize - 4} height={checkboxSize - 4} viewBox="0 0 24 24">
              <Path
                d="M20 6L9 17L4 12"
                stroke={Colors.white}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          )}
        </View>

        {label && (
          <View style={styles.labelWrapper}>
            <Text
              style={[
                styles.label,
                disabled && styles.labelDisabled,
                labelStyle,
              ]}
            >
              {label}
            </Text>
            {helperText && (
              <Text style={[styles.helperText, disabled && styles.helperTextDisabled]}>
                {helperText}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface RadioProps {
  /** Whether radio is selected */
  selected: boolean;
  /** Callback when radio is selected */
  onSelect: () => void;
  /** Radio label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Whether radio is disabled */
  disabled?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Radio size */
  size?: "sm" | "md" | "lg";
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Radio({
  selected,
  onSelect,
  label,
  helperText,
  disabled = false,
  containerStyle,
  size = "md",
  accessibilityLabel,
}: RadioProps) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const radioSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => !disabled && onSelect()}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={accessibilityLabel || label}
    >
      <View style={styles.checkboxWrapper}>
        <View
          style={[
            styles.radio,
            { width: radioSize, height: radioSize },
            disabled && styles.radioDisabled,
          ]}
        >
          {selected && (
            <Circle
              cx={radioSize / 2}
              cy={radioSize / 2}
              r={radioSize / 3.5}
              fill={Colors.primary}
            />
          )}
        </View>

        {label && (
          <View style={styles.labelWrapper}>
            <Text style={[styles.label, disabled && styles.labelDisabled]}>
              {label}
            </Text>
            {helperText && (
              <Text style={[styles.helperText, disabled && styles.helperTextDisabled]}>
                {helperText}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxDisabled: {
    backgroundColor: Colors.muted,
    borderColor: Colors.muted,
  },
  radio: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  radioDisabled: {
    borderColor: Colors.muted,
  },
  labelWrapper: {
    flex: 1,
    paddingTop: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.dark,
  },
  labelDisabled: {
    color: Colors.muted,
  },
  helperText: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
  helperTextDisabled: {
    color: Colors.mutedLight,
  },
});
