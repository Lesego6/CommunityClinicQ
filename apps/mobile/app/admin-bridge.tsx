import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { Colors } from "../constants/colors";
import { useAuthStore } from "../stores/authStore";

export default function AdminBridgeScreen() {
  const router = useRouter();
  const adminName = useAuthStore((s) => s.adminName);
  const logout = useAuthStore((s) => s.logout);

  const openDashboard = async () => {
    router.replace("/admin-dashboard");
  };

  const signOut = () => {
    logout();
    router.replace("/auth/phone");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <ClinicQLogo size={48} />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Admin access granted</Text>
          <Text style={styles.title}>Welcome{adminName ? `, ${adminName}` : ""}</Text>
          <Text style={styles.body}>
            Your private app code was accepted. Open the ClinicQ admin dashboard to manage staff, queues,
            analytics and medication stock.
          </Text>
          <TouchableOpacity onPress={openDashboard} style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Open Admin Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 6,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 8,
    color: Colors.dark,
    fontSize: 28,
    fontWeight: "900",
  },
  body: {
    marginTop: 12,
    color: Colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  primaryBtn: {
    marginTop: 26,
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryBtn: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: Colors.muted,
    fontSize: 14,
    fontWeight: "800",
  },
});
