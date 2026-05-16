import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";

function BackIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LocationIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
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

const TRANSPORT_OPTIONS = [
  { icon: "🚗", label: "Drive", time: "5 min", distance: "1.2 km", detail: "via Washington St", active: true },
  { icon: "🚶", label: "Walk", time: "15 min", distance: "1.2 km", detail: "via Main Rd", active: false },
  { icon: "🚌", label: "Bus", time: "12 min", distance: "1.4 km", detail: "Route 103", active: false },
  { icon: "🚕", label: "Taxi", time: "7 min", distance: "1.2 km", detail: "Minibus taxi", active: false },
];

const ROUTE_STEPS = [
  { step: 1, instruction: "Head north on Washington St", distance: "200 m" },
  { step: 2, instruction: "Turn right onto Bhunga Ave", distance: "350 m" },
  { step: 3, instruction: "Continue straight for 400 m", distance: "400 m" },
  { step: 4, instruction: "Turn left onto Jungle Walk", distance: "150 m" },
  { step: 5, instruction: "Langa Community Clinic will be on your right", distance: "Arrive" },
];

function MockMap() {
  return (
    <View
      style={{
        height: 200,
        backgroundColor: "#E8F0E8",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 360 200" style={{ position: "absolute" }}>
        <Path d="M0 100 H360" stroke="#C8D8C8" strokeWidth={10} />
        <Path d="M0 60 H360" stroke="#C8D8C8" strokeWidth={5} />
        <Path d="M0 140 H360" stroke="#C8D8C8" strokeWidth={5} />
        <Path d="M120 0 V200" stroke="#C8D8C8" strokeWidth={10} />
        <Path d="M240 0 V200" stroke="#C8D8C8" strokeWidth={5} />
        <Path d="M60 0 V200" stroke="#C8D8C8" strokeWidth={5} />
        <Rect x={130} y={10} width={100} height={40} rx={4} fill="#B8D4B8" opacity={0.6} />
        <Rect x={250} y={110} width={80} height={60} rx={4} fill="#B8D4B8" opacity={0.6} />
        {/* Route line */}
        <Path d="M80 150 Q100 100 160 80 Q200 65 230 60" stroke={Colors.blue} strokeWidth={4} strokeDasharray="8,5" fill="none" />
      </Svg>
      {/* User dot */}
      <View style={{ position: "absolute", left: "20%", top: "70%", width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.blue, borderWidth: 3, borderColor: Colors.white }} />
      {/* Pulse */}
      <View style={{ position: "absolute", left: "17%", top: "63%", width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.blue, opacity: 0.15 }} />
      {/* Clinic marker */}
      <View style={{ position: "absolute", left: "60%", top: "25%", width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: Colors.white }}>
        <Text style={{ fontSize: 16 }}>🏥</Text>
      </View>
      {/* Live badge */}
      <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: Colors.white, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
        <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.dark }}>Live location</Text>
      </View>
      {/* Distance badge */}
      <View style={{ position: "absolute", bottom: 10, right: 10, backgroundColor: Colors.white, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.primary }}>1.2 km away</Text>
      </View>
    </View>
  );
}

export default function DirectionsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [activeTransport, setActiveTransport] = useState(0);
  const [loading, setLoading] = useState(false);

  const selected = TRANSPORT_OPTIONS[activeTransport];

  const handleOpenMaps = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Linking.openURL("https://maps.google.com/?q=Langa+Community+Clinic+Cape+Town").catch(() => {
        Alert.alert("Maps unavailable", "Could not open maps on this device.");
      });
    }, 800);
  };

  const handleShareLocation = () => {
    Alert.alert("Location Shared", "Your location has been shared with your emergency contacts.", [{ text: "OK" }]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon size={22} />
        </TouchableOpacity>
        <ClinicQLogo size={28} />
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* Clinic info */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 24 }}>🏥</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>Langa Community Clinic</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <LocationIcon size={12} color={Colors.muted} />
              <Text style={{ fontSize: 12, color: Colors.muted }}>Washington St, Langa, Cape Town</Text>
            </View>
          </View>
          <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.success }}>Open</Text>
          </View>
        </View>

        {/* Map */}
        <MockMap />

        {/* Transport options */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 12 }}>Transport options</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {TRANSPORT_OPTIONS.map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveTransport(i)}
                style={{ flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: activeTransport === i ? Colors.primary : Colors.surface, borderWidth: 1, borderColor: activeTransport === i ? Colors.primary : Colors.border }}
              >
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{opt.icon}</Text>
                <Text style={{ fontSize: 11, fontWeight: "700", color: activeTransport === i ? Colors.white : Colors.dark }}>{opt.label}</Text>
                <Text style={{ fontSize: 12, fontWeight: "800", color: activeTransport === i ? Colors.white : Colors.primary, marginTop: 2 }}>{opt.time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected route info */}
          <View style={{ backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: "800", color: Colors.dark }}>{selected.time}</Text>
              <Text style={{ fontSize: 12, color: Colors.muted }}>{selected.distance} • {selected.detail}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 12, color: Colors.muted }}>Fastest route</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.success }}>No traffic</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Turn-by-turn */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 12 }}>Turn-by-turn directions</Text>
          {ROUTE_STEPS.map((step, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 12, marginBottom: i < ROUTE_STEPS.length - 1 ? 12 : 0 }}>
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: i === ROUTE_STEPS.length - 1 ? Colors.primary : Colors.primaryLight, alignItems: "center", justifyContent: "center" }}>
                  {i === ROUTE_STEPS.length - 1 ? (
                    <Text style={{ fontSize: 14 }}>🏥</Text>
                  ) : (
                    <Text style={{ fontSize: 11, fontWeight: "700", color: Colors.primary }}>{step.step}</Text>
                  )}
                </View>
                {i < ROUTE_STEPS.length - 1 && (
                  <View style={{ width: 2, flex: 1, backgroundColor: Colors.border, marginTop: 4 }} />
                )}
              </View>
              <View style={{ flex: 1, paddingBottom: i < ROUTE_STEPS.length - 1 ? 8 : 0 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.dark }}>{step.instruction}</Text>
                <Text style={{ fontSize: 11, color: Colors.muted, marginTop: 2 }}>{step.distance}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <TouchableOpacity
          onPress={handleOpenMaps}
          disabled={loading}
          style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, opacity: loading ? 0.7 : 1 }}
        >
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>
            {loading ? "Opening Maps..." : "Open in Google Maps"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShareLocation}
          style={{ backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: Colors.border, flexDirection: "row", justifyContent: "center", gap: 8 }}
        >
          <Text style={{ fontSize: 16 }}>↗</Text>
          <Text style={{ color: Colors.dark, fontSize: 15, fontWeight: "600" }}>Share My Location</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
