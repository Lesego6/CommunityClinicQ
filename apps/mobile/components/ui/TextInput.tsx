import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/colors";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error text */
  error?: string;
  /** Left icon/element */
  leftIcon?: React.ReactNode;
  /** Right icon/element (usually action icon) */
  rightIcon?: React.ReactNode;
  /** Callback for right icon press */
  onRightIconPress?: () => void;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Whether input is required (shows asterisk) */
  required?: boolean;
  /** Input size */
  size?: "sm" | "md" | "lg";
}

export function TextInput({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required = false,
  size = "md",
  placeholder,
  editable = true,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 },
    md: { paddingVertical: 12, paddingHorizontal: 14, fontSize: 14 },
    lg: { paddingVertical: 14, paddingHorizontal: 16, fontSize: 16 },
  };

  const size_ = sizeStyles[size];
  const hasError = !!error;
  const isDisabled = !editable;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
          isDisabled && styles.inputWrapperDisabled,
          { paddingLeft: leftIcon ? 12 : 0, paddingRight: rightIcon ? 12 : 0 },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <RNTextInput
          {...props}
          placeholder={placeholder}
          placeholderTextColor={Colors.mutedLight}
          editable={editable}
          style={[
            styles.input,
            {
              paddingVertical: size_.paddingVertical,
              paddingHorizontal: size_.paddingHorizontal,
              fontSize: size_.fontSize,
              color: isDisabled ? Colors.muted : Colors.dark,
            },
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || placeholder}
          accessibilityHint={helperText}
          accessibilityState={{ disabled: isDisabled, invalid: hasError }}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={onRightIconPress}
            disabled={isDisabled || !onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !hasError && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.dark,
  },
  required: {
    color: Colors.danger,
    marginLeft: 3,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingVertical: 0,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  inputWrapperError: {
    borderColor: Colors.danger,
  },
  inputWrapperDisabled: {
    backgroundColor: Colors.surface,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: Colors.dark,
  },
  iconLeft: {
    paddingLeft: 4,
  },
  iconRight: {
    paddingRight: 4,
  },
  helperText: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 6,
  },
});
