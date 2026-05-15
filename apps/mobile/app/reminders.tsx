import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../constants/colors";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";

// ─── Icons ───────────────────────────────────────────────────────────────────

function BellIcon({ size = 22, hasDot = false }: { size?: number; hasDot?: boolean }) {
  return (
    <View style={{ position: "relative" }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" fill={Colors.dark} />
        <Path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18H20L18 16Z" stroke={Colors.dark} strokeWidth={2} fill="none" />
      </Svg>
      {hasDot && (
        <View style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary, borderWidth: 1.5, borderColor: Colors.white }} />
      )}
    </View>
  );
}

function PlusIcon({ size = 22, color = Colors.dark }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
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

function DotsIcon({ size = 18, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={5} r={1.5} fill={color} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
      <Circle cx={12} cy={19} r={1.5} fill={color} />
    </Svg>
  );
}

function ClockIcon({ size = 13, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
      <Path d="M12 7V12L15 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon({ size = 18, color = Colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Filter Tabs ─────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { id: "all", label: "All", icon: "🔔" },
  { id: "medications", label: "Medications", icon: "💊" },
  { id: "appointments", label: "Appointments", icon: "📅" },
  { id: "health", label: "Health Tasks", icon: "📋" },
];

// ─── Reminder Card ────────────────────────────────────────────────────────────

type ReminderType = "medication" | "appointment" | "health";

interface Reminder {
  id: string;
  type: ReminderType;
  typeLabel: string;
  title: string;
  subtitle: string;
  time: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  icon: string;
  iconBg: string;
}

const UPCOMING_REMINDERS: Reminder[] = [
  {
    id: "1",
    type: "medication",
    typeLabel: "Medication",
    title: "Paracetamol 500mg",
    subtitle: "1 tablet • After breakfast",
    time: "Today • 08:00 AM",
    badge: "Due in 18 min",
    badgeColor: Colors.secondary,
    badgeBg: Colors.secondaryLight,
    icon: "💊",
    iconBg: Colors.secondaryLight,
  },
  {
    id: "2",
    type: "appointment",
    typeLabel: "Appointment",
    title: "Langa Community Clinic",
    subtitle: "General check-up",
    time: "Tomorrow • 10:00 AM",
    badge: "Tomorrow",
    badgeColor: Colors.primary,
    badgeBg: Colors.primaryLight,
    icon: "📅",
    iconBg: Colors.primaryLight,
  },
  {
    id: "3",
    type: "medication",
    typeLabel: "Medication",
    title: "Amoxicillin 250mg",
    subtitle: "1 capsule • After lunch",
    time: "Tomorrow • 01:00 PM",
    badge: "In 4 hr",
    badgeColor: Colors.teal,
    badgeBg: Colors.tealLight,
    icon: "💊",
    iconBg: Colors.tealLight,
  },
  {
    id: "4",
    type: "health",
    typeLabel: "Health Task",
    title: "Blood pressure check",
    subtitle: "Track your blood pressure",
    time: "Sat, 18 May • 09:00 AM",
    badge: "In 2 days",
    badgeColor: Colors.purple,
    badgeBg: Colors.purpleLight,
    icon: "💗",
    iconBg: Colors.purpleLight,
  },
];

const COMPLETED_REMINDERS: Reminder[] = [
  {
    id: "5",
    type: "medication",
    typeLabel: "Medication",
    title: "Vitamin C 500mg",
    subtitle: "1 tablet • After breakfast",
    time: "Today • 07:00 AM",
    badge: "Taken",
    badgeColor: Colors.muted,
    badgeBg: Colors.surface,
    icon: "💊",
    iconBg: Colors.surface,
  },
];

function ReminderCard({ item, completed = false }: { item: Reminder; completed?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {/* Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: item.iconBg,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text style={{ fontSize: 22 }}>{item.icon}</Text>
          {completed && (
            <View
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: Colors.success,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: Colors.white,
              }}
            >
              <CheckIcon size={10} color={Colors.white} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <View
              style={{
                backgroundColor: item.badgeBg,
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "700", color: item.badgeColor }}>{item.typeLabel}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, fontWeight: "700", color: completed ? Colors.muted : Colors.dark }}>
            {item.title}
          </Text>
          <Text style={{ fontSize: 12, color: Colors.muted }}>{item.subtitle}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <ClockIcon size={12} color={Colors.muted} />
            <Text style={{ fontSize: 11, color: Colors.muted }}>{item.time}</Text>
          </View>
        </View>

        {/* Badge + dots */}
        <View style={{ alignItems: "flex-end", gap: 8 }}>
          <View
            style={{
              backgroundColor: item.badgeBg,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: item.badgeColor }}>{item.badge}</Text>
          </View>
          <TouchableOpacity>
            <DotsIcon size={18} color={Colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function RemindersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

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
        <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.dark }}>Reminders</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity>
            <BellIcon size={22} hasDot />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlusIcon size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ── Hero Banner ── */}
        <View
          style={{
            backgroundColor: Colors.primaryLight,
            marginHorizontal: 20,
            marginTop: 16,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.dark, lineHeight: 26 }}>
              Never miss{"\n"}what matters 💚
            </Text>
            <Text style={{ fontSize: 13, color: Colors.muted, marginTop: 6, lineHeight: 18 }}>
              Get reminded about your medicines, appointments and important health tasks.
            </Text>
          </View>
          {/* Illustration */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 48 }}>⏰</Text>
            <Text style={{ fontSize: 32 }}>📅</Text>
          </View>
        </View>

        {/* ── Filter Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 14, gap: 10 }}
        >
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveFilter(tab.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: activeFilter === tab.id ? Colors.primary : Colors.white,
                borderWidth: 1,
                borderColor: activeFilter === tab.id ? Colors.primary : Colors.border,
              }}
            >
              <Text style={{ fontSize: 14 }}>{tab.icon}</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: activeFilter === tab.id ? Colors.white : Colors.muted,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Upcoming Reminders ── */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Upcoming reminders</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View all</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {UPCOMING_REMINDERS.map((item) => (
            <ReminderCard key={item.id} item={item} />
          ))}
        </View>

        {/* ── Completed Reminders ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Completed reminders</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View history</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {COMPLETED_REMINDERS.map((item) => (
            <ReminderCard key={item.id} item={item} completed />
          ))}
        </View>

        {/* ── Enable Alerts Banner ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 8,
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
            <BellIcon size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>Stay on track</Text>
            <Text style={{ fontSize: 12, color: Colors.muted }}>Enable notifications so we can remind you on time, every time.</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: "700" }}>Enable Alerts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
