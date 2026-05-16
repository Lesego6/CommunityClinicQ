import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { Colors } from "../constants/colors";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { useAppStore } from "../stores/appStore";

// ─── Icons ───────────────────────────────────────────────────────────────────

function ShieldIcon({ size = 22, color = Colors.dark }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} fill="none" />
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

function CheckCircleIcon({ size = 18, color = Colors.success }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} fill={color} />
      <Path d="M8 12L11 15L16 9" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CalendarIcon({ size = 16, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={18} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M3 9H21M8 2V6M16 2V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PersonIcon({ size = 16, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function AlertIcon({ size = 16, color = Colors.warning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth={2} fill="none" />
      <Path d="M12 9V13M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function HeartIcon({ size = 16, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function PillIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.5 3.5C8.01472 3.5 6 5.51472 6 8V16C6 18.4853 8.01472 20.5 10.5 20.5C12.9853 20.5 15 18.4853 15 16V8C15 5.51472 12.9853 3.5 10.5 3.5Z" stroke={color} strokeWidth={2} />
      <Path d="M6 12H15" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function BuildingIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={18} height={18} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M9 9H9.01M15 9H15.01M9 15H9.01M15 15H15.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function NoteIcon({ size = 16, color = Colors.warning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={18} height={18} rx={2} fill={color + "30"} stroke={color} strokeWidth={2} />
      <Path d="M8 8H16M8 12H16M8 16H12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ShareIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function InfoIcon({ size = 14, color = Colors.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
      <Path d="M12 8V12M12 16h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TABS = ["Overview", "Vaccinations", "Prescriptions", "Visit History", "Notes"];

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function HealthRecordsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const user = useAppStore((s) => s.user);

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
        <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.dark }}>Health Records</Text>
        <TouchableOpacity>
          <ShieldIcon size={22} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ── Patient Card ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            marginHorizontal: 20,
            marginTop: 16,
            borderRadius: 20,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: Colors.primaryLight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 28 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: Colors.dark }}>{user.name}</Text>
            <Text style={{ fontSize: 12, color: Colors.muted }}>ID: 960725 1234 08 7</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.danger }} />
              <Text style={{ fontSize: 12, color: Colors.danger, fontWeight: "600" }}>
                Blood Type: {user.bloodType ?? "Unknown"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: Colors.primaryLight,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.primary }}>View Health ID</Text>
            <ChevronRightIcon size={12} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: Colors.white, marginTop: 12 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 0 }}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 14,
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

        {/* ── Health Summary ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Health Summary</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: "row", gap: 16 }}>
              {[
                { icon: <CalendarIcon size={16} color={Colors.muted} />, label: "Date of Birth", value: "25 Jul 1996" },
                { icon: <PersonIcon size={16} color={Colors.muted} />, label: "Gender", value: "Female" },
                { icon: <AlertIcon size={16} color={Colors.warning} />, label: "Allergies", value: "None" },
                { icon: <HeartIcon size={16} color={Colors.muted} />, label: "Chronic Conditions", value: "Hypertension" },
              ].map((item) => (
                <View key={item.label} style={{ flex: 1, alignItems: "center" }}>
                  {item.icon}
                  <Text style={{ fontSize: 10, color: Colors.muted, marginTop: 4, textAlign: "center" }}>{item.label}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.dark, textAlign: "center", marginTop: 2 }}>{item.value}</Text>
                </View>
              ))}
            </View>
            {/* Update info banner */}
            <View
              style={{
                backgroundColor: Colors.blueLight,
                borderRadius: 10,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 14,
              }}
            >
              <InfoIcon size={14} color={Colors.blue} />
              <Text style={{ flex: 1, fontSize: 12, color: Colors.blue }}>Keep your health records up to date for better care.</Text>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.blue }}>Update Info</Text>
                <ChevronRightIcon size={12} color={Colors.blue} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Vaccination History ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Vaccination History</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View all</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {[
              { name: "COVID-19 Vaccine", detail: "Pfizer", date: "12 May 2022" },
              { name: "Tetanus (TT)", detail: "Booster", date: "03 Aug 2021" },
              { name: "Measles", detail: "Dose 1", date: "15 Mar 1998" },
              { name: "Hepatitis B", detail: "3 Doses", date: "1996–1997" },
              { name: "HPV Vaccine", detail: "2 Doses", date: "10 Jan 2015" },
            ].map((v, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: i < 4 ? 1 : 0,
                  borderBottomColor: Colors.border,
                  gap: 10,
                }}
              >
                <CheckCircleIcon size={18} color={Colors.success} />
                <Text style={{ flex: 1, fontSize: 13, fontWeight: "600", color: Colors.dark }}>{v.name}</Text>
                <Text style={{ fontSize: 12, color: Colors.muted, flex: 0.8 }}>{v.detail}</Text>
                <Text style={{ fontSize: 12, color: Colors.muted }}>{v.date}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Recent Prescriptions ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Recent Prescriptions</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View all</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {[
              { name: "Amoxicillin 500mg", dosage: "1 Capsule • 3 times a day • 5 days", doctor: "Dr. N. Dlamini", date: "23 May 2024", clinic: "Langa Community Clinic" },
              { name: "Amlodipine 5mg", dosage: "1 Tablet • Once daily", doctor: "Dr. N. Dlamini", date: "23 May 2024", clinic: "Langa Community Clinic" },
            ].map((p, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: i < 1 ? 1 : 0,
                  borderBottomColor: Colors.border,
                  gap: 12,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center" }}>
                  <PillIcon size={18} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>{p.name}</Text>
                  <Text style={{ fontSize: 11, color: Colors.muted }}>{p.dosage}</Text>
                  <Text style={{ fontSize: 11, color: Colors.muted }}>{p.doctor}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.primary }}>{p.date}</Text>
                  <Text style={{ fontSize: 10, color: Colors.muted }}>{p.clinic}</Text>
                </View>
                <ChevronRightIcon size={14} color={Colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Recent Visit History ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Recent Visit History</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View all</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {[
              { clinic: "Langa Community Clinic", type: "General Consultation", doctor: "Dr. N. Dlamini", date: "23 May 2024", time: "09:15 AM" },
              { clinic: "Gugulethu Clinic", type: "Follow-up Visit", doctor: "Dr. S. Jacobs", date: "12 Apr 2024", time: "10:30 AM" },
              { clinic: "Nyanga Day Clinic", type: "Flu-like Symptoms", doctor: "Dr. L. Maseko", date: "05 Mar 2024", time: "11:00 AM" },
            ].map((v, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: i < 2 ? 1 : 0,
                  borderBottomColor: Colors.border,
                  gap: 12,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center" }}>
                  <BuildingIcon size={18} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>{v.clinic}</Text>
                  <Text style={{ fontSize: 11, color: Colors.muted }}>{v.type}</Text>
                  <Text style={{ fontSize: 11, color: Colors.muted }}>{v.doctor}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 11, color: Colors.muted }}>{v.date} • {v.time}</Text>
                  <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.success }}>Completed</Text>
                  </View>
                </View>
                <ChevronRightIcon size={14} color={Colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Clinic Notes ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Clinic Notes</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View all</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {[
              { note: "Follow-up on blood pressure in 3 months.", doctor: "Dr. N. Dlamini", date: "23 May 2024" },
              { note: "Patient advised to reduce salt intake and exercise regularly.", doctor: "Dr. N. Dlamini", date: "23 May 2024" },
            ].map((n, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: i < 1 ? 1 : 0,
                  borderBottomColor: Colors.border,
                  gap: 12,
                }}
              >
                <NoteIcon size={20} color={Colors.warning} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, color: Colors.dark }}>{n.note}</Text>
                  <Text style={{ fontSize: 11, color: Colors.muted }}>{n.doctor} • {n.date}</Text>
                </View>
                <ChevronRightIcon size={14} color={Colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Reminder + Share ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: Colors.primaryLight,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>Reminder</Text>
            <Text style={{ fontSize: 12, color: Colors.muted }}>Keep your records updated and share with your doctor for better care.</Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: Colors.white,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <ShareIcon size={14} color={Colors.primary} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.primary }}>Share Records</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
