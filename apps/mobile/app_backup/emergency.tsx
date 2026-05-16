import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { Colors } from "../constants/colors";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";

// ─── Icons ───────────────────────────────────────────────────────────────────

function BellIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" fill={Colors.dark} />
      <Path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18H20L18 16Z" stroke={Colors.dark} strokeWidth={2} fill="none" />
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
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 14,
        alignItems: "center",
        gap: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
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

const CLINIC_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=120&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&q=80",
];

const EMERGENCY_CLINICS = [
  {
    num: 1,
    name: "Langa Community Clinic",
    type: "Emergency Services",
    distance: "1.2 km away",
    area: "Langa, Cape Town",
    hours: "Open 24/7",
    wait: "Low wait",
    waitLevel: "low" as const,
    arrival: "5 min",
    imageIndex: 0,
  },
  {
    num: 2,
    name: "Gugulethu Hospital",
    type: "Emergency Services",
    distance: "2.4 km away",
    area: "Gugulethu, Cape Town",
    hours: "Open 24/7",
    wait: "Moderate wait",
    waitLevel: "moderate" as const,
    arrival: "8 min",
    imageIndex: 1,
  },
  {
    num: 3,
    name: "Nyanga Day Hospital",
    type: "Emergency Services",
    distance: "3.1 km away",
    area: "Nyanga, Cape Town",
    hours: "Open 24/7",
    wait: "Low wait",
    waitLevel: "low" as const,
    arrival: "10 min",
    imageIndex: 2,
  },
];

function EmergencyClinicCard({ clinic }: { clinic: typeof EMERGENCY_CLINICS[0] }) {
  const waitColor = clinic.waitLevel === "low" ? Colors.low : clinic.waitLevel === "moderate" ? Colors.moderate : Colors.busy;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
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
            <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.danger }}>{clinic.type}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <LocationIcon size={11} color={Colors.muted} />
            <Text style={{ fontSize: 11, color: Colors.muted }}>{clinic.distance} • {clinic.area}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
              <Text style={{ fontSize: 11, color: Colors.success, fontWeight: "600" }}>{clinic.hours}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <PeopleIcon color={waitColor} size={12} />
              <Text style={{ fontSize: 11, color: waitColor, fontWeight: "600" }}>{clinic.wait}</Text>
            </View>
          </View>
        </View>
        {/* Arrival time */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 10, color: Colors.muted }}>Est. arrival</Text>
          <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.danger }}>{clinic.arrival}</Text>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}
      >
        <ClinicQLogo size={28} />
        <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.danger }}>Emergency Mode</Text>
        <TouchableOpacity>
          <BellIcon size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* ── Panic Banner ── */}
        <View
          style={{
            backgroundColor: Colors.redLight,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            borderWidth: 1,
            borderColor: Colors.danger + "40",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: Colors.danger }}>In an emergency?</Text>
            <Text style={{ fontSize: 13, color: Colors.darkMid, marginTop: 4 }}>
              We're here to help. Get immediate assistance.
            </Text>
          </View>
          {/* Panic button */}
          <TouchableOpacity
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: Colors.danger,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: Colors.danger,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: 4,
              borderColor: Colors.danger + "40",
            }}
          >
            <Text style={{ fontSize: 28 }}>🚨</Text>
            <Text style={{ fontSize: 10, fontWeight: "800", color: Colors.white, marginTop: 2 }}>PANIC / HELP</Text>
          </TouchableOpacity>
          {/* Action list */}
          <View style={{ gap: 8 }}>
            {[
              { icon: "📍", label: "Share your location" },
              { icon: "🔔", label: "Alert emergency contacts" },
              { icon: "🏥", label: "Get help fast" },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                <Text style={{ fontSize: 11, color: Colors.darkMid, fontWeight: "500" }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick Call ── */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Quick call</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.danger }}>All numbers</Text>
              <ChevronRightIcon size={14} color={Colors.danger} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
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
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.danger }}>View on map</Text>
              <LocationIcon size={13} color={Colors.danger} />
            </TouchableOpacity>
          </View>
          {EMERGENCY_CLINICS.map((clinic) => (
            <EmergencyClinicCard key={clinic.num} clinic={clinic} />
          ))}
        </View>

        {/* ── Map + Directions ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark }}>Share Location</Text>
            <Text style={{ fontSize: 14 }}>↗</Text>
          </TouchableOpacity>
        </View>

        {/* ── Medical ID ── */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.white,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
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
          <TouchableOpacity
            style={{
              backgroundColor: Colors.redLight,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.danger }}>View Medical ID</Text>
          </TouchableOpacity>
          <ChevronRightIcon size={16} color={Colors.muted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
