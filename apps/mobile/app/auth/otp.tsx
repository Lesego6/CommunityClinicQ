import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { useAuthStore, DEMO_OTP } from "../../stores/authStore";
import { useAppStore } from "../../stores/appStore";

const OTP_LENGTH = 4;
// Countdown duration in seconds before "Resend" becomes active
const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const router = useRouter();
  const phone = useAuthStore((s) => s.phone);
  const login = useAuthStore((s) => s.login);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (text: string, index: number) => {
    // Accept only digits; handle paste of full code
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 1) {
      // Pasted full code
      const pasted = cleaned.slice(0, OTP_LENGTH).split("");
      const next = [...digits];
      pasted.forEach((d, i) => { next[i] = d; });
      setDigits(next);
      inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setError("");

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const enteredCode = digits.join("");
  const isComplete = enteredCode.length === OTP_LENGTH;

  const handleVerify = () => {
    if (!isComplete) return;

    setVerifying(true);
    // Simulate a short network delay for realism
    setTimeout(() => {
      if (enteredCode === DEMO_OTP) {
        login();
        completeOnboarding();
        router.replace("/(tabs)/home");
      } else {
        setError("Incorrect code. Try 1234.");
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
      setVerifying(false);
    }, 600);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setCountdown(RESEND_SECONDS);
    inputRefs.current[0]?.focus();
  };

  // Mask phone: +27 82 *** 4567
  const maskedPhone = phone
    ? phone.replace(/(\+\d{2})(\d{2})(\d{3})(\d{4})/, "$1 $2 *** $4")
    : "your number";

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
            <Text style={{ fontSize: 52, marginBottom: 12 }}>🔐</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: Colors.dark,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Verify your number
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.muted,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Enter the 4-digit code sent to{"\n"}
              <Text style={{ fontWeight: "700", color: Colors.dark }}>{maskedPhone}</Text>
            </Text>
          </View>

          {/* Demo OTP banner */}
          <View
            style={{
              backgroundColor: Colors.yellowLight,
              borderRadius: 14,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <Text style={{ fontSize: 22 }}>🧪</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.warning }}>
                Demo mode
              </Text>
              <Text style={{ fontSize: 13, color: Colors.darkMid, marginTop: 2 }}>
                Use OTP:{" "}
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 16,
                    color: Colors.dark,
                    letterSpacing: 4,
                  }}
                >
                  {DEMO_OTP}
                </Text>
              </Text>
            </View>
          </View>

          {/* OTP boxes */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => { inputRefs.current[i] = r; }}
                style={{
                  width: 64,
                  height: 72,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: error
                    ? Colors.danger
                    : d
                    ? Colors.primary
                    : Colors.border,
                  backgroundColor: d ? Colors.primaryLight : Colors.surface,
                  textAlign: "center",
                  fontSize: 28,
                  fontWeight: "800",
                  color: Colors.dark,
                }}
                keyboardType="number-pad"
                // Box 0: maxLength=OTP_LENGTH so a pasted "1234" reaches onChangeText intact.
                // Boxes 1-3: maxLength=1 so typing one digit auto-advances correctly.
                maxLength={i === 0 ? OTP_LENGTH : 1}
                value={d}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                autoFocus={i === 0}
                selectTextOnFocus
              />
            ))}
          </View>

          {error ? (
            <Text
              style={{
                fontSize: 13,
                color: Colors.danger,
                textAlign: "center",
                marginBottom: 20,
                fontWeight: "600",
              }}
            >
              {error}
            </Text>
          ) : (
            <View style={{ height: 28 }} />
          )}

          {/* Resend */}
          <View
            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4, marginBottom: 32 }}
          >
            <Text style={{ fontSize: 13, color: Colors.muted }}>Didn't receive it?</Text>
            <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: countdown > 0 ? Colors.mutedLight : Colors.primary,
                }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }} />

          {/* CTA */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isComplete || verifying}
            style={{
              backgroundColor: isComplete && !verifying ? Colors.primary : Colors.border,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              shadowColor: isComplete ? Colors.primary : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: isComplete ? 4 : 0,
            }}
          >
            <Text
              style={{
                color: isComplete && !verifying ? Colors.white : Colors.muted,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {verifying ? "Verifying…" : "Verify & Continue"}
            </Text>
          </TouchableOpacity>

          {/* Back link */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ alignItems: "center", paddingVertical: 16 }}
          >
            <Text style={{ fontSize: 13, color: Colors.muted }}>
              ← Change phone number
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
