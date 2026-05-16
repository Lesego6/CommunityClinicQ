import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  FlatList,
} from "react-native";
import { Colors } from "../../constants/colors";
import { ChevronDownIcon, CloseIcon } from "./Icons";

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
}

interface SelectProps {
  /** Select label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Available options */
  options: SelectOption[];
  /** Currently selected value */
  value?: string | number | null;
  /** Callback when option is selected */
  onChange: (value: string | number) => void;
  /** Whether select is disabled */
  disabled?: boolean;
  /** Whether select is multiple */
  multiple?: boolean;
  /** Helper text */
  helperText?: string;
  /** Error text */
  error?: string;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Whether field is required */
  required?: boolean;
}

export function Select({
  label,
  placeholder = "Select an option...",
  options,
  value,
  onChange,
  disabled = false,
  multiple = false,
  helperText,
  error,
  containerStyle,
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.selectTrigger,
          value && styles.selectTriggerActive,
          error && styles.selectTriggerError,
          disabled && styles.selectTriggerDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={label || "Select"}
      >
        <Text
          style={[
            styles.selectTriggerText,
            !value && styles.selectPlaceholderText,
          ]}
        >
          {displayLabel}
        </Text>
        <ChevronDownIcon
          size={18}
          color={disabled ? Colors.muted : Colors.dark}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Select Option"}</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <CloseIcon size={24} color={Colors.dark} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item.value && styles.optionItemActive,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: value === item.value }}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        value === item.value && styles.optionLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text
                        style={[
                          styles.optionDescription,
                          value === item.value && styles.optionDescriptionActive,
                        ]}
                      >
                        {item.description}
                      </Text>
                    )}
                  </View>
                  {value === item.value && (
                    <View
                      style={[
                        styles.radioButton,
                        styles.radioButtonActive,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              )}
              scrollEnabled
              nestedScrollEnabled
            />
          </View>
        </View>
      </Modal>
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
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  selectTriggerActive: {
    borderColor: Colors.primary,
  },
  selectTriggerError: {
    borderColor: Colors.danger,
  },
  selectTriggerDisabled: {
    backgroundColor: Colors.surface,
    opacity: 0.6,
  },
  selectTriggerText: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: "500",
  },
  selectPlaceholderText: {
    color: Colors.muted,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark,
  },

  // Options
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.dark,
  },
  optionLabelActive: {
    fontWeight: "700",
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  optionDescriptionActive: {
    color: Colors.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    marginLeft: 12,
  },
  radioButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Messages
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 6,
  },
  helperText: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 6,
  },
});
