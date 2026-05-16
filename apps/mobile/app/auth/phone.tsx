import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { useAuthStore } from "../../stores/authStore";
import { navigateWithBlur } from "../../utils/ui";

const COUNTRY_CODE = "+27";

export default function PhoneScreen() {
  const router = useRouter();
  const setPhone = useAuthStore((s) => s.setPhone);

  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  // Strip spaces/dashes for validation
  const digits = number.replace(/\D/g, "");
  const isValid = digits.length >= 9;

  const handleContinue = () => {
    if (!isValid) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setPhone(`${COUNTRY_CODE}${digits}`);
    navigateWithBlur(router, "/auth/otp");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginTop: 16, marginBottom: 40 }}>
            <ClinicQLogo size={36} />
          </View>

          {/* Hero */}
          <View
            style={{
              backgroundColor: Colors.primaryLight,
              borderRadius: 24,
              padding: 28,
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <Text style={{ fontSize: 52, marginBottom: 12 }}>📱</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: Colors.dark,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Enter your phone number
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.muted,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              We'll send a one-time code to verify your number. Standard rates may apply.
            </Text>
          </View>

          {/* Input */}
          <Text
            style={{ fontSize: 13, fontWeight: "600", color: Colors.darkMid, marginBottom: 8 }}
          >
            Phone number
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: error ? Colors.danger : number ? Colors.primary : Colors.border,
              borderRadius: 14,
              backgroundColor: Colors.surface,
              overflow: "hidden",
              marginBottom: 6,
            }}
          >
            {/* Country code badge */}
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 16,
                backgroundColor: Colors.primaryLight,
                borderRightWidth: 1.5,
                borderRightColor: Colors.border,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.primary }}>
                {COUNTRY_CODE}
              </Text>
            </View>
            <TextInput
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: "600",
                color: Colors.dark,
                paddingHorizontal: 14,
                paddingVertical: 16,
                letterSpacing: 1,
              }}
              placeholder="82 123 4567"
              placeholderTextColor={Colors.mutedLight}
              keyboardType="phone-pad"
              value={number}
              onChangeText={(t) => {
                setNumber(t);
                if (error) setError("");
              }}
              maxLength={12}
              autoFocus
            />
          </View>

          {error ? (
            <Text style={{ fontSize: 12, color: Colors.danger, marginBottom: 8 }}>{error}</Text>
          ) : (
            <Text style={{ fontSize: 12, color: Colors.muted, marginBottom: 8 }}>
              South Africa (+27) · 9–10 digits
            </Text>
          )}

          {/* Demo hint */}
          <View
            style={{
              backgroundColor: Colors.yellowLight,
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
            }}
          >
            <Text style={{ fontSize: 18 }}>💡</Text>
            <Text style={{ flex: 1, fontSize: 13, color: Colors.warning, fontWeight: "600" }}>
              Demo mode — any number works. OTP is{" "}
              <Text style={{ fontWeight: "800" }}>1234</Text>.
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          {/* CTA */}
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              backgroundColor: isValid ? Colors.primary : Colors.border,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              shadowColor: isValid ? Colors.primary : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: isValid ? 4 : 0,
            }}
          >
            <Text
              style={{
                color: isValid ? Colors.white : Colors.muted,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
