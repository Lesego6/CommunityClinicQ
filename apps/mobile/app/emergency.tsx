import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  StyleSheet,
  Platform,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { Colors } from "../constants/colors";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { getBottomPadding } from "../utils/ui";
import { CLINICS, CLINIC_IMAGES, type Clinic } from "../constants/clinics";

// ─── Icons ───────────────────────────────────────────────────────────────────

function BellIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" fill={Colors.dark} />
      <Path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18H20L18 16Z" stroke={Colors.dark} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function BackIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LocationIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={9} r={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PeopleIcon({ color = Colors.low, size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={3} stroke={color} strokeWidth={2} />
      <Path d="M3 20C3 17.2386 5.68629 15 9 15C12.3137 15 15 17.2386 15 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={17} cy={7} r={2.5} stroke={color} strokeWidth={1.5} />
      <Path d="M21 20C21 18.3431 19.2091 17 17 17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Emergency Quick Call ─────────────────────────────────────────────────────

function QuickCallCard({
  emoji,
  label,
  number,
  color,
  onPress,
}: {
  emoji: string;
  label: string;
  number: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: "48%",
        minHeight: 128,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 14,
        alignItems: "center",
        gap: 4,
        ...softShadow,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: color + "20",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
      <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.dark }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: "800", color }}>{number}</Text>
      <Text style={{ fontSize: 10, color: Colors.muted }}>24/7</Text>
    </TouchableOpacity>
  );
}

// ─── Emergency Clinic Card ────────────────────────────────────────────────────

type EmergencyClinic = Clinic & {
  emergencyType: string;
  emergencyHours: string;
  emergencyArrival: string;
};

const EMERGENCY_CLINICS: EmergencyClinic[] = CLINICS.slice(0, 3).map((clinic, index) => ({
  ...clinic,
  emergencyType: "Emergency Services",
  emergencyHours: "Open 24/7",
  emergencyArrival: index === 0 ? "5 min" : index === 1 ? "8 min" : "10 min",
}));

function EmergencyClinicCard({ clinic, onPress }: { clinic: EmergencyClinic; onPress: () => void }) {
  const waitColor = clinic.trafficLevel === "low" ? Colors.low : clinic.trafficLevel === "moderate" ? Colors.moderate : Colors.busy;
  const waitLabel = clinic.trafficLevel === "low" ? "Low wait" : clinic.trafficLevel === "moderate" ? "Moderate wait" : "High wait";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
        ...softShadow,
        elevation: 2,
      }}
    >
      {/* Number badge */}
      <View
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: Colors.danger,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Text style={{ color: Colors.white, fontSize: 11, fontWeight: "700" }}>{clinic.num}</Text>
      </View>

      <View style={{ flexDirection: "row", padding: 12, gap: 12 }}>
        <Image
          source={{ uri: CLINIC_IMAGES[clinic.imageIndex] }}
          style={{ width: 80, height: 80, borderRadius: 12 }}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>{clinic.name}</Text>
          <View style={{ backgroundColor: Colors.redLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginTop: 2 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.danger }}>{clinic.emergencyType}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <LocationIcon size={11} color={Colors.muted} />
            <Text style={{ fontSize: 11, color: Colors.muted }}>{clinic.distance} away • {clinic.area}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
              <Text style={{ fontSize: 11, color: Colors.success, fontWeight: "600" }}>{clinic.emergencyHours}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <PeopleIcon color={waitColor} size={12} />
              <Text style={{ fontSize: 11, color: waitColor, fontWeight: "600" }}>{waitLabel}</Text>
            </View>
          </View>
        </View>
        {/* Arrival time */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 10, color: Colors.muted }}>Est. arrival</Text>
          <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.danger }}>{clinic.emergencyArrival}</Text>
          <ChevronRightIcon size={16} color={Colors.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Mock Map ─────────────────────────────────────────────────────────────────

function EmergencyMap() {
  return (
    <View
      style={{
        height: 140,
        backgroundColor: "#E8F0E8",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 360 140" style={{ position: "absolute" }}>
        <Path d="M0 70 H360" stroke="#C8D8C8" strokeWidth={8} />
        <Path d="M0 40 H360" stroke="#C8D8C8" strokeWidth={4} />
        <Path d="M120 0 V140" stroke="#C8D8C8" strokeWidth={8} />
        <Path d="M240 0 V140" stroke="#C8D8C8" strokeWidth={4} />
        <Rect x={130} y={10} width={100} height={30} rx={4} fill="#B8D4B8" opacity={0.6} />
      </Svg>
      {/* Route line */}
      <Svg width="100%" height="100%" viewBox="0 0 360 140" style={{ position: "absolute" }}>
        <Path d="M80 100 Q120 70 200 60" stroke={Colors.blue} strokeWidth={3} strokeDasharray="6,4" fill="none" />
      </Svg>
      {/* User dot */}
      <View style={{ position: "absolute", left: "20%", top: "65%", width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.blue, borderWidth: 3, borderColor: Colors.white }} />
      {/* Clinic marker */}
      <View style={{ position: "absolute", left: "52%", top: "35%", width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.danger, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: Colors.white }}>
        <Text style={{ fontSize: 14 }}>🏥</Text>
      </View>
      {/* Live location badge */}
      <View style={{ position: "absolute", top: 8, left: 8, backgroundColor: Colors.white, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
        <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.dark }}>Live location</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function EmergencyScreen() {
  const router = useRouter();
  const nearestEmergencyClinic = EMERGENCY_CLINICS[0];
  const emergencyLocation = "-33.9249, 18.4241";
  const openEmergencyMap = () => {
    router.push({
      pathname: "/clinic/directions",
      params: {
        clinicId: nearestEmergencyClinic.id,
        clinicName: nearestEmergencyClinic.name,
      },
    });
  };
  const copyEmergencyLocation = async () => {
    const message = `ClinicQ emergency location: ${emergencyLocation}`;
    if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(message);
      Alert.alert("Location copied", "Your emergency location is ready to paste into a message.");
      return;
    }
    await Share.share({ title: "Emergency location", message });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top"]}>
      {/* Header */}
      <View
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <ClinicQLogo size={26} />
          <Text style={styles.headerTitle}>Emergency Mode</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert("Emergency alerts", "Emergency mode is active. Use quick call or panic/help for urgent support.")}>
          <BellIcon size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: getBottomPadding(28) }}>
        {/* ── Panic Banner ── */}
        <View
          style={{
            backgroundColor: Colors.redLight,
            borderRadius: 20,
            padding: 20,
            alignItems: "stretch",
            gap: 16,
            borderWidth: 1,
            borderColor: Colors.danger + "40",
          }}
        >
          <View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: Colors.danger }}>In an emergency?</Text>
            <Text style={{ fontSize: 13, color: Colors.darkMid, marginTop: 4 }}>
              We're here to help. Get immediate assistance.
            </Text>
          </View>
          <View style={styles.panicRow}>
            {/* Panic button */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Emergency help",
                  "Call emergency services immediately if you are in danger.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Call 112", onPress: () => Linking.openURL("tel:112") },
                  ]
                )
              }
              style={styles.panicButton}
            >
              <Text style={{ fontSize: 28 }}>🚨</Text>
              <Text style={styles.panicButtonText}>PANIC / HELP</Text>
            </TouchableOpacity>
            {/* Action list */}
            <View style={styles.panicActions}>
              {[
                { icon: "📍", label: "Share your location" },
                { icon: "🔔", label: "Alert emergency contacts" },
                { icon: "🏥", label: "Get help fast" },
              ].map((item) => (
                <View key={item.label} style={styles.panicActionRow}>
                  <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                  <Text style={styles.panicActionText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Quick Call ── */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Quick call</Text>
            <TouchableOpacity onPress={() => Alert.alert("Emergency numbers", "Ambulance: 10177\nPolice: 10111\nEmergency care: 112")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.danger }}>All numbers</Text>
              <ChevronRightIcon size={14} color={Colors.danger} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <QuickCallCard emoji="🚑" label="Ambulance" number="10177" color={Colors.danger} onPress={() => Linking.openURL("tel:10177")} />
            <QuickCallCard emoji="🚔" label="Police" number="10111" color={Colors.blue} onPress={() => Linking.openURL("tel:10111")} />
            <QuickCallCard emoji="🔥" label="Fire" number="10177" color={Colors.orange} onPress={() => Linking.openURL("tel:10177")} />
            <QuickCallCard emoji="🎧" label="Emergency Care" number="112" color={Colors.yellow} onPress={() => Linking.openURL("tel:112")} />
          </View>
        </View>

        {/* ── Nearest Emergency Clinics ── */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Nearest emergency clinics</Text>
            <TouchableOpacity onPress={openEmergencyMap} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.danger }}>View on map</Text>
              <LocationIcon size={13} color={Colors.danger} />
            </TouchableOpacity>
          </View>
          {EMERGENCY_CLINICS.map((clinic) => (
            <EmergencyClinicCard
              key={clinic.id}
              clinic={clinic}
              onPress={() => router.push(`/clinic/${clinic.id}`)}
            />
          ))}
        </View>

        {/* ── Map + Directions ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 16,
            ...softShadow,
            elevation: 2,
          }}
        >
          <EmergencyMap />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 22 }}>🚗</Text>
                <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.dark }}>5 min</Text>
                <Text style={{ fontSize: 13, color: Colors.muted }}>(1.2 km)</Text>
              </View>
              <Text style={{ fontSize: 12, color: Colors.muted }}>via Washington St</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={openEmergencyMap}
            style={{
              backgroundColor: Colors.danger,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 15, fontWeight: "700" }}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={copyEmergencyLocation}
            style={{
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 14,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 8,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark }}>Copy Location</Text>
            <Text style={{ fontSize: 14 }}>↗</Text>
          </TouchableOpacity>
        </View>

        {/* ── Medical ID ── */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/health-records", params: { showHealthId: "1" } })}
          style={{
            backgroundColor: Colors.white,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            ...softShadow,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: Colors.redLight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24 }}>🩺</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>Medical ID</Text>
            <Text style={{ fontSize: 12, color: Colors.muted }}>
              Tap to view your medical information that can help doctors treat you faster.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.redLight,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.danger }}>View Medical ID</Text>
          </View>
          <ChevronRightIcon size={16} color={Colors.muted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const softShadow = {
  boxShadow: "0 2px 10px rgba(15, 23, 42, 0.08)",
} as const;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.danger,
  },
  panicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  panicButton: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(220, 38, 38, 0.28)",
    elevation: 8,
    borderWidth: 4,
    borderColor: Colors.danger + "40",
  },
  panicButtonText: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.white,
    marginTop: 2,
    textAlign: "center",
  },
  panicActions: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  panicActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  panicActionText: {
    flex: 1,
    fontSize: 12,
    color: Colors.darkMid,
    fontWeight: "700",
    lineHeight: 16,
  },
});
