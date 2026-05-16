/**
 * UI Component Types
 *
 * Export all TypeScript types and interfaces used by UI components.
 * Use these for type-safe prop validation.
 */

import { ViewStyle, TextStyle } from "react-native";
import type { TextInputProps as RNTextInputProps } from "react-native";

// ── Button Types ──────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

// ── Card Types ────────────────────────────────────────────────────────────

export type CardVariant = "elevated" | "outlined" | "flat";

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padded?: boolean;
  padding?: number;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

// ── TextInput Types ───────────────────────────────────────────────────────

export interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
  size?: "sm" | "md" | "lg";
}

// ── Checkbox/Radio Types ──────────────────────────────────────────────────

export interface CheckboxProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  size?: "sm" | "md" | "lg";
  accessibilityLabel?: string;
}

export interface RadioProps {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  size?: "sm" | "md" | "lg";
  accessibilityLabel?: string;
}

// ── Badge Types ───────────────────────────────────────────────────────────

export type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

// ── Alert Types ───────────────────────────────────────────────────────────

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  title?: string;
  message: string;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  onClose?: () => void;
  style?: ViewStyle;
}

// ── Divider Types ─────────────────────────────────────────────────────────

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  color?: string;
  thickness?: number;
  style?: ViewStyle;
  margin?: number;
}

// ── Spacer Types ──────────────────────────────────────────────────────────

export interface SpacerProps {
  size?: number;
  height?: number;
  width?: number;
  style?: ViewStyle;
}

// ── Loading Types ─────────────────────────────────────────────────────────

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  style?: ViewStyle;
}

// ── Tag Types ─────────────────────────────────────────────────────────────

export interface TagProps {
  label: string;
  variant?: "filled" | "outlined";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  removable?: boolean;
  onRemove?: () => void;
  size?: "sm" | "md";
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

// ── Select Types ──────────────────────────────────────────────────────────

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number | null;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  multiple?: boolean;
  helperText?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

// ── Reusable Custom Types ─────────────────────────────────────────────────

export interface BaseComponentProps {
  /** Custom container style */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export interface FormFieldProps extends BaseComponentProps {
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
}

export interface SizeProps {
  /** Component size */
  size?: "sm" | "md" | "lg";
}

export interface VariantProps<T extends string> {
  /** Visual variant */
  variant?: T;
}

export interface ColorProps {
  /** Component color */
  color?: string;
}

// ── Icon Props ────────────────────────────────────────────────────────────

export interface IconProps {
  size?: number;
  color?: string;
}
