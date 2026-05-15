import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";

// ─── Icons ───────────────────────────────────────────────────────────────────

function BackIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HeartIcon({ size = 22, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function ShareIcon({ size = 22, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

function StarIcon({ size = 14, color = Colors.yellow }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
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

function CheckIcon({ size = 16, color = Colors.success }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ClockIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
      <Path d="M12 7V12L15 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PeopleIcon({ color = Colors.primary, size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={3} stroke={color} strokeWidth={2} />
      <Path d="M3 20C3 17.2386 5.68629 15 9 15C12.3137 15 15 17.2386 15 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={17} cy={7} r={2.5} stroke={color} strokeWidth={1.5} />
      <Path d="M21 20C21 18.3431 19.2091 17 17 17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function DirectionsIcon({ size = 16, color = Colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11L22 2L13 21L11 13L3 11Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TABS = ["Overview", "Doctors", "Queue", "Services", "Reviews", "Photos"];

// ─── Rating Bar ───────────────────────────────────────────────────────────────

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <Text style={{ fontSize: 12, color: Colors.muted, width: 16 }}>{stars}</Text>
      <StarIcon size={11} />
      <View style={{ flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: 3 }}>
        <View style={{ height: 6, backgroundColor: Colors.yellow, borderRadius: 3, width: `${percent}%` }} />
      </View>
      <Text style={{ fontSize: 11, color: Colors.muted, width: 30 }}>{percent}%</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ClinicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const CLINIC_PHOTOS = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&q=80",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&q=80",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200&q=80",
    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&q=80",
  ];

  const PHOTO_LABELS = ["Exterior", "Waiting Area", "Consultation Room", "Pharmacy", "Immunization"];

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
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon size={22} />
        </TouchableOpacity>
        <ClinicQLogo size={28} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity><HeartIcon size={22} color={Colors.muted} /></TouchableOpacity>
          <TouchableOpacity><ShareIcon size={22} color={Colors.muted} /></TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ── Clinic Hero ── */}
        <View style={{ backgroundColor: Colors.white }}>
          <Image
            source={{ uri: CLINIC_PHOTOS[0] }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
          <View style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: Colors.white, fontSize: 11 }}>1 / 8</Text>
          </View>
        </View>

        {/* ── Clinic Info ── */}
        <View style={{ backgroundColor: Colors.white, padding: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.dark }}>Langa Community Clinic</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                <StarIcon size={14} />
                <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>4.6</Text>
                <Text style={{ fontSize: 13, color: Colors.muted }}>(128 reviews)</Text>
              </View>
              <Text style={{ fontSize: 13, color: Colors.muted, marginTop: 2 }}>Primary Health Care Clinic</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                <LocationIcon size={13} color={Colors.muted} />
                <Text style={{ fontSize: 12, color: Colors.muted }}>1.2 km away • Washington St, Langa, Cape Town</Text>
              </View>
            </View>
            <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.success }}>Open Now</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <TouchableOpacity
              style={{
                flex: 2,
                backgroundColor: Colors.primary,
                borderRadius: 12,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <DirectionsIcon size={16} color={Colors.white} />
              <Text style={{ color: Colors.white, fontSize: 14, fontWeight: "700" }}>Get Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.surface,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.dark }}>📞 Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.surface,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.dark }}>🌐 Website</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.surface,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.dark }}>🔖 Saved</Text>
            </TouchableOpacity>
          </View>

          {/* Status row */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colors.surface,
              borderRadius: 14,
              padding: 14,
              marginTop: 14,
              gap: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: Colors.muted }}>Open Now</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.dark }}>Closes at 16:00</Text>
            </View>
            <View style={{ width: 1, backgroundColor: Colors.border }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: Colors.muted }}>Current Queue</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <PeopleIcon color={Colors.primary} size={14} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.dark }}>24 people</Text>
              </View>
              <Text style={{ fontSize: 11, color: Colors.muted }}>Est. wait 35–45 min</Text>
            </View>
            <View style={{ width: 1, backgroundColor: Colors.border }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: Colors.muted }}>Live Status</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.success }}>Normal</Text>
              </View>
              <Text style={{ fontSize: 11, color: Colors.muted }}>Not too busy</Text>
            </View>
          </View>
        </View>

        {/* ── Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 14,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab ? Colors.primary : "transparent",
                marginRight: 4,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: activeTab === tab ? Colors.primary : Colors.muted }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Overview Content ── */}
        <View style={{ padding: 20, gap: 20 }}>
          {/* Services + Doctors row */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/* Services */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>Services Offered</Text>
                <TouchableOpacity><Text style={{ fontSize: 12, color: Colors.primary }}>View all</Text></TouchableOpacity>
              </View>
              {[
                "General Consultations",
                "Chronic Disease Management",
                "Maternal & Child Health",
                "Immunization",
                "Family Planning",
                "HIV Testing & Counselling",
                "TB Screening & Treatment",
              ].map((s) => (
                <View key={s} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <CheckIcon size={14} color={Colors.success} />
                  <Text style={{ fontSize: 12, color: Colors.dark }}>{s}</Text>
                </View>
              ))}
            </View>

            {/* Doctors */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>Doctors Available</Text>
                <TouchableOpacity><Text style={{ fontSize: 12, color: Colors.primary }}>View all</Text></TouchableOpacity>
              </View>
              {[
                { name: "Dr. Sipho Dlamini", role: "General Practitioner", hours: "Mon – Fri\n08:00 – 16:00", available: true },
                { name: "Dr. Nandi Maseko", role: "General Practitioner", hours: "Mon – Fri\n08:00 – 16:00", available: true },
              ].map((doc) => (
                <TouchableOpacity
                  key={doc.name}
                  style={{
                    backgroundColor: Colors.surface,
                    borderRadius: 12,
                    padding: 10,
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18 }}>👨‍⚕️</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.dark }}>{doc.name}</Text>
                    <Text style={{ fontSize: 10, color: Colors.muted }}>{doc.role}</Text>
                    <Text style={{ fontSize: 10, color: Colors.muted }}>{doc.hours}</Text>
                  </View>
                  <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 10, fontWeight: "600", color: Colors.success }}>Available</Text>
                  </View>
                  <ChevronRightIcon size={12} color={Colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Queue + Medication row */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/* Current Queue */}
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>Current Queue</Text>
                <TouchableOpacity><Text style={{ fontSize: 11, color: Colors.primary }}>View full queue</Text></TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", marginBottom: 8 }}>
                <Text style={{ fontSize: 11, color: Colors.muted }}>Your Queue Number</Text>
                <Text style={{ fontSize: 36, fontWeight: "900", color: Colors.primary }}>A023</Text>
                <Text style={{ fontSize: 11, color: Colors.muted }}>You are 5 people away</Text>
                <Text style={{ fontSize: 11, color: Colors.muted }}>Est. wait time: 35–45 min</Text>
              </View>
              {/* Progress bar */}
              <View style={{ height: 6, backgroundColor: Colors.border, borderRadius: 3, marginBottom: 8 }}>
                <View style={{ height: 6, backgroundColor: Colors.primary, borderRadius: 3, width: "60%" }} />
              </View>
              <Text style={{ fontSize: 10, color: Colors.muted, textAlign: "center" }}>We'll notify you when it's almost your turn.</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.redLight,
                  borderRadius: 10,
                  paddingVertical: 8,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.danger }}>Leave Queue</Text>
              </TouchableOpacity>
            </View>

            {/* Medication Stock */}
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>Medication Stock</Text>
                <TouchableOpacity><Text style={{ fontSize: 11, color: Colors.primary }}>View all</Text></TouchableOpacity>
              </View>
              {[
                { name: "Paracetamol 500mg", status: "In Stock", color: Colors.success },
                { name: "Amoxicillin 250mg", status: "Low Stock", color: Colors.warning },
                { name: "Metformin 500mg", status: "In Stock", color: Colors.success },
                { name: "Amlodipine 5mg", status: "In Stock", color: Colors.success },
                { name: "Salbutamol Inhaler", status: "Out of Stock", color: Colors.danger },
              ].map((med) => (
                <View key={med.name} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <Text style={{ fontSize: 11, color: Colors.dark, flex: 1 }}>{med.name}</Text>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: med.color }}>{med.status}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primaryLight,
                  borderRadius: 10,
                  paddingVertical: 8,
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.primary }}>See all medications</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Opening Hours + Reviews row */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/* Opening Hours */}
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>Opening Hours</Text>
                <TouchableOpacity><Text style={{ fontSize: 11, color: Colors.primary }}>View all hours</Text></TouchableOpacity>
              </View>
              {[
                { day: "Monday – Friday", hours: "08:00 – 16:00" },
                { day: "Saturday", hours: "08:00 – 13:00" },
                { day: "Sunday", hours: "Closed" },
                { day: "Public Holidays", hours: "Closed" },
              ].map((h) => (
                <View key={h.day} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <ClockIcon size={12} color={Colors.muted} />
                    <Text style={{ fontSize: 11, color: Colors.muted }}>{h.day}</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: h.hours === "Closed" ? Colors.danger : Colors.dark }}>{h.hours}</Text>
                </View>
              ))}
            </View>

            {/* Reviews */}
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>Reviews</Text>
                <TouchableOpacity><Text style={{ fontSize: 11, color: Colors.primary }}>View all</Text></TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 32, fontWeight: "900", color: Colors.dark }}>4.6</Text>
                  <View style={{ flexDirection: "row", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} size={12} color={s <= 4 ? Colors.yellow : Colors.border} />
                    ))}
                  </View>
                  <Text style={{ fontSize: 10, color: Colors.muted }}>(128 reviews)</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <RatingBar stars={5} percent={78} />
                  <RatingBar stars={4} percent={14} />
                  <RatingBar stars={3} percent={5} />
                  <RatingBar stars={2} percent={2} />
                  <RatingBar stars={1} percent={1} />
                </View>
              </View>
            </View>
          </View>

          {/* Photos */}
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Photos</Text>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View all</Text>
                <ChevronRightIcon size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {CLINIC_PHOTOS.map((photo, i) => (
                <View key={i} style={{ alignItems: "center" }}>
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 100, height: 80, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                  <Text style={{ fontSize: 10, color: Colors.muted, marginTop: 4 }}>{PHOTO_LABELS[i]}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
