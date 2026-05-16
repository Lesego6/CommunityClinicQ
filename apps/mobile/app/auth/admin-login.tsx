import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { Colors } from "../../constants/colors";
import { ADMIN_PRIVATE_CODE, useAuthStore } from "../../stores/authStore";
import { navigateWithBlur } from "../../utils/ui";

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LockIcon({ color = Colors.primary }: { color?: string }) {
  return (
    <Svg width={34} height={34} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={10} width={14} height={10} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M8 10V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V10" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={15} r={1.4} fill={color} />
    </Svg>
  );
}

function PersonIcon({ color = Colors.mutedLight }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path d="M4 20C4 16.7 7.6 14.5 12 14.5C16.4 14.5 20 16.7 20 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function AdminLoginScreen() {
  const router = useRouter();
  const adminLogin = useAuthStore((s) => s.adminLogin);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = async () => {
    const allowed = adminLogin(name, code);

    if (!allowed) {
      setError("Access denied. Check your name and private app code.");
      Alert.alert("Access denied", "The private app code is incorrect.");
      return;
    }

    setError("");
    router.replace("/admin-dashboard");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
              <BackIcon />
            </TouchableOpacity>
            <ClinicQLogo size={34} />
            <View style={{ width: 42 }} />
          </View>

          <View style={styles.hero}>
            <View style={styles.lockBubble}>
              <LockIcon />
            </View>
            <Text style={styles.title}>Admin Login</Text>
            <Text style={styles.subtitle}>
              Enter your staff name and private app code to open the ClinicQ admin dashboard.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputShell}>
              <View style={styles.inputIcon}>
                <PersonIcon />
              </View>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (error) setError("");
                }}
                placeholder="Enter your staff name"
                placeholderTextColor={Colors.mutedLight}
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <Text style={[styles.label, { marginTop: 22 }]}>Private App Code</Text>
            <View style={[styles.inputShell, error ? styles.inputShellError : null]}>
              <View style={styles.inputIcon}>
                <LockIcon color={Colors.mutedLight} />
              </View>
              <TextInput
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  if (error) setError("");
                }}
                placeholder="Enter private app code"
                placeholderTextColor={Colors.mutedLight}
                style={styles.input}
                autoCapitalize="characters"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleAdminLogin}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : <Text style={styles.helpText}>Demo private code: {ADMIN_PRIVATE_CODE}</Text>}

            <TouchableOpacity onPress={handleAdminLogin} activeOpacity={0.85} style={styles.button}>
              <Text style={styles.buttonText}>Open Admin Dashboard</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigateWithBlur(router, "/auth/phone")} style={styles.patientLink}>
            <Text style={styles.patientText}>Continue as patient instead</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 28,
  },
  lockBubble: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: Colors.primary,
  },
  subtitle: {
    maxWidth: 340,
    marginTop: 10,
    color: Colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 6,
  },
  label: {
    color: Colors.dark,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  inputShell: {
    minHeight: 62,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D8DCE2",
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
  },
  inputShellError: {
    borderColor: Colors.danger,
  },
  inputIcon: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    color: Colors.dark,
    fontSize: 17,
    fontWeight: "600",
    paddingVertical: 14,
    paddingRight: 12,
  },
  helpText: {
    marginTop: 12,
    color: Colors.muted,
    fontSize: 13,
  },
  errorText: {
    marginTop: 12,
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "800",
  },
  button: {
    minHeight: 62,
    borderRadius: 14,
    marginTop: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
  patientLink: {
    alignItems: "center",
    marginTop: 26,
  },
  patientText: {
    color: Colors.primary,
    fontWeight: "900",
    fontSize: 14,
  },
});
