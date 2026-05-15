import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { useAppStore } from "../../stores/appStore";

function BackIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon({ size = 20, color = Colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const QUEUE_TYPES = [
  { id: "general", label: "General Outpatients", icon: "🏥", desc: "General consultations and check-ups" },
  { id: "chronic", label: "Chronic Care", icon: "💊", desc: "Chronic disease management & medication" },
  { id: "maternal", label: "Maternal & Child", icon: "👶", desc: "Antenatal, postnatal & child health" },
  { id: "hiv", label: "HIV / TB Services", icon: "🩺", desc: "HIV testing, counselling & TB screening" },
];

const QUEUE_NUMBERS: Record<string, string> = {
  general: "A",
  chronic: "B",
  maternal: "C",
  hiv: "D",
};

const PEOPLE_AHEAD: Record<string, number> = {
  general: 22,
  chronic: 8,
  maternal: 5,
  hiv: 12,
};

const WAIT_TIMES: Record<string, string> = {
  general: "35–45 min",
  chronic: "15–20 min",
  maternal: "10–15 min",
  hiv: "20–30 min",
};

export default function CheckinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ clinicId?: string; clinicName?: string }>();
  const joinQueue = useAppStore((s) => s.joinQueue);
  const activeTicket = useAppStore((s) => s.activeTicket);

  const clinicId = params.clinicId || "langa-community";
  const clinicName = params.clinicName || "Langa Community Clinic";

  const [selectedType, setSelectedType] = useState("general");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (activeTicket && activeTicket.status !== "cancelled" && activeTicket.status !== "done") {
      Alert.alert(
        "Already in queue",
        `You are already in the queue at ${activeTicket.clinicName}. Leave that queue first before joining a new one.`,
        [
          { text: "Stay in current queue", style: "cancel" },
          {
            text: "Leave & join new",
            style: "destructive",
            onPress: () => doJoin(),
          },
        ]
      );
      return;
    }
    doJoin();
  };

  const doJoin = () => {
    setLoading(true);
    setTimeout(() => {
      const prefix = QUEUE_NUMBERS[selectedType] || "A";
      const num = Math.floor(Math.random() * 30) + 10;
      const queueNumber = `${prefix}${String(num).padStart(3, "0")}`;
      const serviceLabel = QUEUE_TYPES.find((t) => t.id === selectedType)?.label || "General Outpatients";

      joinQueue({
        clinicId,
        clinicName,
        clinicAddress: "Washington St, Langa, Cape Town",
        queueNumber,
        serviceType: serviceLabel,
        joinedAt: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
        estimatedWait: WAIT_TIMES[selectedType] || "35–45 min",
        peopleAhead: PEOPLE_AHEAD[selectedType] || 22,
      });

      setLoading(false);
      router.replace("/queue/ticket");
    }, 1500);
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Title */}
        <View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: Colors.dark }}>Join the Queue</Text>
          <Text style={{ fontSize: 14, color: Colors.muted, marginTop: 4 }}>
            Select your service type and check in remotely.
          </Text>
        </View>

        {/* Clinic info */}
        <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 32 }}>🏥</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>{clinicName}</Text>
            <Text style={{ fontSize: 12, color: Colors.muted }}>Langa, Cape Town • 1.2 km away</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
              <Text style={{ fontSize: 12, color: Colors.success, fontWeight: "600" }}>Open Now</Text>
              <Text style={{ fontSize: 12, color: Colors.muted }}>• {PEOPLE_AHEAD[selectedType]} people in queue</Text>
            </View>
          </View>
        </View>

        {/* Queue type selection */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark, marginBottom: 12 }}>
            Select Service Type
          </Text>
          {QUEUE_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              style={{ backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 2, borderColor: selectedType === type.id ? Colors.primary : Colors.border }}
            >
              <Text style={{ fontSize: 28 }}>{type.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>{type.label}</Text>
                <Text style={{ fontSize: 12, color: Colors.muted }}>{type.desc}</Text>
                <Text style={{ fontSize: 11, color: Colors.primary, marginTop: 2 }}>
                  Est. wait: {WAIT_TIMES[type.id]} • {PEOPLE_AHEAD[type.id]} people ahead
                </Text>
              </View>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: selectedType === type.id ? Colors.primary : Colors.border, alignItems: "center", justifyContent: "center" }}>
                {selectedType === type.id && <CheckIcon size={14} color={Colors.white} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark, marginBottom: 8 }}>
            Additional Notes (optional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="E.g. I need a repeat prescription for chronic medication..."
            placeholderTextColor={Colors.muted}
            multiline
            numberOfLines={3}
            style={{ backgroundColor: Colors.white, borderRadius: 14, padding: 14, fontSize: 14, color: Colors.dark, borderWidth: 1, borderColor: Colors.border, minHeight: 80, textAlignVertical: "top" }}
          />
        </View>

        {/* Confirm button */}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10, opacity: loading ? 0.8 : 1 }}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <CheckIcon size={20} color={Colors.white} />
          )}
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>
            {loading ? "Joining queue..." : "Confirm Check-In"}
          </Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={{ fontSize: 12, color: Colors.muted, textAlign: "center", lineHeight: 18 }}>
          By checking in, you agree to arrive at the clinic within 30 minutes of your estimated turn.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
