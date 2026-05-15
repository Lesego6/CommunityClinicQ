import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { useAppStore } from "../../stores/appStore";

function CheckIcon({ size = 16, color = Colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const PERMISSIONS = [
  {
    id: "location",
    emoji: "📍",
    title: "Location Access",
    desc: "Find clinics near you and get accurate directions.",
    required: true,
  },
  {
    id: "notifications",
    emoji: "🔔",
    title: "Push Notifications",
    desc: "Get queue updates, appointment reminders, and medication alerts.",
    required: true,
  },
  {
    id: "camera",
    emoji: "📷",
    title: "Camera Access",
    desc: "Scan QR codes at clinic kiosks for quick check-in.",
    required: false,
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [granted, setGranted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleGrant = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setGranted((prev) => ({ ...prev, [id]: true }));
      setLoading(false);
    }, 600);
  };

  const allRequiredGranted = PERMISSIONS.filter((p) => p.required).every((p) => granted[p.id]);

  const handleContinue = () => {
    if (!allRequiredGranted) {
      Alert.alert(
        "Permissions needed",
        "Location and notification permissions are required for the best experience. Please grant them to continue.",
        [{ text: "OK" }]
      );
      return;
    }
    completeOnboarding();
    router.replace("/auth/phone");
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace("/auth/phone");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <ClinicQLogo size={28} />
        <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>App Permissions</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.muted }}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, padding: 20, gap: 20 }}>
        {/* Hero */}
        <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 20, padding: 24, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>🔐</Text>
          <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.dark, textAlign: "center", marginTop: 12 }}>
            Enable permissions
          </Text>
          <Text style={{ fontSize: 13, color: Colors.muted, textAlign: "center", marginTop: 6, lineHeight: 19 }}>
            CliniqQ needs a few permissions to give you the best experience. Your privacy is always protected.
          </Text>
        </View>

        {/* Permissions */}
        <View style={{ gap: 12 }}>
          {PERMISSIONS.map((perm) => (
            <View
              key={perm.id}
              style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}
            >
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: granted[perm.id] ? Colors.primaryLight : Colors.surface, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 26 }}>{perm.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>{perm.title}</Text>
                  {perm.required && (
                    <View style={{ backgroundColor: Colors.redLight, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: Colors.danger }}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 12, color: Colors.muted, marginTop: 2 }}>{perm.desc}</Text>
              </View>
              {granted[perm.id] ? (
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center" }}>
                  <CheckIcon size={16} color={Colors.white} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleGrant(perm.id)}
                  disabled={loading}
                  style={{ backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
                >
                  <Text style={{ color: Colors.white, fontSize: 12, fontWeight: "700" }}>Allow</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Privacy note */}
        <View style={{ backgroundColor: Colors.blueLight, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
          <Text style={{ fontSize: 16 }}>🛡️</Text>
          <Text style={{ flex: 1, fontSize: 12, color: Colors.blue, lineHeight: 18 }}>
            Your data is never sold or shared with third parties. We only use it to improve your healthcare experience.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={handleContinue}
            style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
          >
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>
              {allRequiredGranted ? "Get Started" : "Continue"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={{ alignItems: "center", paddingVertical: 8 }}>
            <Text style={{ fontSize: 13, color: Colors.muted }}>Set up later in Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
