/**
 * CommunityClinicQ UI Component Library - Usage Examples
 *
 * This file demonstrates how to use all the components in the UI library.
 * Copy and adapt these examples for your screens.
 */

import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Card,
  TextInput,
  Checkbox,
  Radio,
  Badge,
  Alert,
  Divider,
  Spacer,
  Loading,
  Tag,
  Select,
  SearchIcon,
  LocationIcon,
} from "@/components/ui";
import { Colors } from "@/constants/colors";

// Example: Basic Button Usage
export function ButtonExamples() {
  return (
    <Card>
      <Button label="Primary Button" variant="primary" size="md" />
      <Spacer size={8} />
      <Button label="Secondary Button" variant="secondary" />
      <Spacer size={8} />
      <Button label="Outline Button" variant="outline" />
      <Spacer size={8} />
      <Button label="Ghost Button" variant="ghost" />
      <Spacer size={8} />
      <Button label="Danger Button" variant="danger" />
      <Spacer size={8} />

      {/* Button with icon */}
      <Button
        label="With Icon"
        leftIcon={<SearchIcon size={18} color="white" />}
        onPress={() => console.log("Pressed")}
      />
      <Spacer size={8} />

      {/* Button sizes */}
      <Button label="Small" size="sm" />
      <Spacer size={8} />
      <Button label="Large" size="lg" fullWidth />
    </Card>
  );
}

// Example: Form Components
export function FormExamples() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedType, setSelectedType] = useState("general");
  const [agreed, setAgreed] = useState(false);

  return (
    <Card>
      <TextInput
        label="Full Name"
        placeholder="Enter your name"
        required
        value={name}
        onChangeText={setName}
        leftIcon={<SearchIcon size={16} color={Colors.muted} />}
      />

      <TextInput
        label="Phone Number"
        placeholder="+27..."
        value={phone}
        onChangeText={setPhone}
        error={phone && !/^27\d{9}$/.test(phone) ? "Invalid number" : ""}
      />

      <Select
        label="Service Type"
        placeholder="Choose a service"
        options={[
          { value: "general", label: "General Consultation" },
          { value: "chronic", label: "Chronic Care" },
          { value: "maternal", label: "Maternal & Child Health" },
        ]}
        value={selectedType}
        onChange={(v) => setSelectedType(v)}
      />

      <Checkbox
        label="I agree to terms"
        checked={agreed}
        onToggle={setAgreed}
        helperText="You must agree to continue"
      />

      <Spacer size={12} />

      <Radio
        label="Option 1"
        selected={true}
        onSelect={() => {}}
      />
      <Radio
        label="Option 2"
        selected={false}
        onSelect={() => {}}
      />
    </Card>
  );
}

// Example: Badges and Tags
export function BadgeExamples() {
  return (
    <Card>
      <Badge label="Primary" variant="primary" />
      <Spacer size={8} />
      <Badge label="Success" variant="success" />
      <Spacer size={8} />
      <Badge label="Warning" variant="warning" dot />
      <Spacer size={8} />
      <Badge label="Danger" variant="danger" />

      <Divider margin={16} />

      <Tag label="Removable Tag" removable onRemove={() => {}} />
      <Spacer size={8} />
      <Tag label="Outlined" variant="outlined" color="primary" />
    </Card>
  );
}

// Example: Alerts
export function AlertExamples() {
  return (
    <Card>
      <Alert
        title="Information"
        message="This is an informational alert with a title and message."
        variant="info"
        icon={<View style={{ width: 20, height: 20, backgroundColor: Colors.blue, borderRadius: 10 }} />}
      />
      <Spacer size={12} />

      <Alert
        message="Success! Your appointment has been confirmed."
        variant="success"
      />
      <Spacer size={12} />

      <Alert
        title="Warning"
        message="Please arrive at least 15 minutes before your appointment time."
        variant="warning"
      />
      <Spacer size={12} />

      <Alert
        title="Error"
        message="Something went wrong. Please try again."
        variant="error"
        onClose={() => {}}
      />
    </Card>
  );
}

// Example: Complete Form
export function CompleteFormExample() {
  const [formData, setFormData] = useState({
    clinicId: "",
    serviceType: "",
    notes: "",
    notificationsEnabled: true,
    agreeTerms: false,
  });

  const handleSubmit = () => {
    if (!formData.agreeTerms) {
      Alert.alert("Please agree to terms");
      return;
    }
    console.log("Submitting form:", formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card>
        <TextInput
          label="Select Clinic"
          placeholder="Search and select clinic"
          value={formData.clinicId}
          onChangeText={(text) =>
            setFormData({ ...formData, clinicId: text })
          }
          leftIcon={<LocationIcon size={16} color={Colors.primary} />}
        />

        <Select
          label="Service Type"
          placeholder="What service do you need?"
          options={[
            {
              value: "general",
              label: "General Consultation",
              description: "General health check-up",
            },
            {
              value: "chronic",
              label: "Chronic Care",
              description: "Long-term condition management",
            },
            {
              value: "maternal",
              label: "Maternal & Child Health",
              description: "Pregnancy and child care",
            },
          ]}
          value={formData.serviceType}
          onChange={(v) => setFormData({ ...formData, serviceType: v })}
        />

        <TextInput
          label="Additional Notes (Optional)"
          placeholder="Any special requirements or conditions?"
          multiline
          numberOfLines={3}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
        />

        <Checkbox
          label="Enable SMS notifications"
          checked={formData.notificationsEnabled}
          onToggle={(checked) =>
            setFormData({ ...formData, notificationsEnabled: checked })
          }
          helperText="We'll send you updates about your queue status"
        />

        <Checkbox
          label="I agree to the terms and conditions"
          checked={formData.agreeTerms}
          onToggle={(checked) =>
            setFormData({ ...formData, agreeTerms: checked })
          }
          required
        />

        <Spacer size={16} />

        <Button
          label="Confirm & Join Queue"
          variant="primary"
          fullWidth
          onPress={handleSubmit}
        />

        <Spacer size={8} />

        <Button
          label="Cancel"
          variant="outline"
          fullWidth
          onPress={() => console.log("Cancelled")}
        />
      </Card>
    </ScrollView>
  );
}

// Example: Demonstration Screen
export default function ComponentDemoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Buttons */}
        <View style={styles.section}>
          <ButtonExamples />
        </View>

        <Spacer size={20} />

        {/* Forms */}
        <View style={styles.section}>
          <FormExamples />
        </View>

        <Spacer size={20} />

        {/* Badges & Tags */}
        <View style={styles.section}>
          <BadgeExamples />
        </View>

        <Spacer size={20} />

        {/* Alerts */}
        <View style={styles.section}>
          <AlertExamples />
        </View>

        <Spacer size={20} />

        {/* Complete Form */}
        <View style={styles.section}>
          <CompleteFormExample />
        </View>

        <Spacer size={40} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    gap: 12,
  },
});
