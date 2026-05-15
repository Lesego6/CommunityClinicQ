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

function SettingsIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={Colors.dark} strokeWidth={2} />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={Colors.dark} strokeWidth={2} />
    </Svg>
  );
}

// ─── Filter Tabs ─────────────────────────────────────────────────────────────

const FILTER_TABS = ["All", "Queues", "Appointments", "Medications", "System"];

// ─── Notification Item ────────────────────────────────────────────────────────

type NotifType = "queue" | "appointment" | "medication" | "system" | "health";

interface NotifItem {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  tag?: string;
  tagColor?: string;
  unread?: boolean;
}

const NOTIFICATIONS: { section: string; items: NotifItem[] }[] = [
  {
    section: "Today",
    items: [
      {
        id: "1",
        type: "queue",
        title: "You're 5 people away!",
        body: "Good news! You're next in line soon at Langa Community Clinic. Please be ready.",
        time: "09:35 AM",
        tag: "Queue • Langa Community Clinic",
        tagColor: Colors.primary,
        unread: true,
      },
      {
        id: "2",
        type: "appointment",
        title: "Appointment reminder",
        body: "You have an appointment tomorrow at 10:00 AM at Langa Community Clinic.",
        time: "08:15 AM",
        tag: "Appointment",
        tagColor: Colors.secondary,
        unread: true,
      },
      {
        id: "3",
        type: "medication",
        title: "Medication ready for collection",
        body: "Your medication (Paracetamol 500mg) is ready for collection at Gugulettu Clinic Pharmacy.",
        time: "07:45 AM",
        tag: "Medication",
        tagColor: Colors.teal,
        unread: true,
      },
    ],
  },
  {
    section: "Yesterday",
    items: [
      {
        id: "4",
        type: "queue",
        title: "You have joined the queue",
        body: "You have successfully joined the queue at Nyanga Day Clinic. Your number is B012.",
        time: "Yesterday, 02:30 PM",
        tag: "Queue • Nyanga Day Clinic",
        tagColor: Colors.primary,
      },
      {
        id: "5",
        type: "system",
        title: "Clinic update",
        body: "Walk-in services may be slower than usual today at Delft Community Clinic due to high patient volume.",
        time: "Yesterday, 11:20 AM",
        tag: "System",
        tagColor: Colors.muted,
      },
    ],
  },
  {
    section: "This week",
    items: [
      {
        id: "6",
        type: "health",
        title: "Health tip of the week",
        body: "Drink plenty of water, eat healthy and get enough rest. Small steps lead to a healthier you!",
        time: "Mon, 12 May, 09:00 AM",
        tag: "Health Tip",
        tagColor: Colors.danger,
      },
    ],
  },
];

const NOTIF_ICONS: Record<NotifType, { bg: string; emoji: string }> = {
  queue: { bg: Colors.primaryLight, emoji: "👥" },
  appointment: { bg: Colors.yellowLight, emoji: "📅" },
  medication: { bg: Colors.tealLight, emoji: "💊" },
  system: { bg: Colors.purpleLight, emoji: "📢" },
  health: { bg: Colors.redLight, emoji: "🏥" },
};

function NotifCard({ item }: { item: NotifItem }) {
  const iconConfig = NOTIF_ICONS[item.type];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        flexDirection: "row",
        gap: 12,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
      }}
    >
      {/* Unread dot */}
      <View style={{ width: 8, justifyContent: "center", alignItems: "center" }}>
        {item.unread && (
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary }} />
        )}
      </View>

      {/* Icon */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: iconConfig.bg,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 20 }}>{iconConfig.emoji}</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark, flex: 1, marginRight: 8 }}>
            {item.title}
          </Text>
          <Text style={{ fontSize: 11, color: Colors.muted, flexShrink: 0 }}>{item.time}</Text>
        </View>
        <Text style={{ fontSize: 12, color: Colors.muted, marginTop: 3, lineHeight: 17 }}>{item.body}</Text>
        {item.tag && (
          <View
            style={{
              alignSelf: "flex-start",
              marginTop: 6,
              backgroundColor: (item.tagColor || Colors.primary) + "18",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "600", color: item.tagColor || Colors.primary }}>
              {item.tag}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

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
        <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.dark }}>Notifications</Text>
        <TouchableOpacity>
          <SettingsIcon size={22} />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 8 }}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveFilter(tab)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: activeFilter === tab ? Colors.primary : Colors.surface,
              borderWidth: 1,
              borderColor: activeFilter === tab ? Colors.primary : Colors.border,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            {tab === "All" && (
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" fill={activeFilter === tab ? Colors.white : Colors.muted} />
                <Path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18H20L18 16Z" stroke={activeFilter === tab ? Colors.white : Colors.muted} strokeWidth={2} fill="none" />
              </Svg>
            )}
            <Text style={{ fontSize: 13, fontWeight: "600", color: activeFilter === tab ? Colors.white : Colors.muted }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* ── Hero Banner ── */}
        <View
          style={{
            backgroundColor: Colors.primary,
            marginHorizontal: 20,
            marginTop: 16,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: Colors.white + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 26 }}>🔔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.white }}>Stay informed, get better care</Text>
            <Text style={{ fontSize: 12, color: Colors.white + "CC", marginTop: 4, lineHeight: 17 }}>
              We'll notify you about your queue, appointments, medications and important updates.
            </Text>
          </View>
          {/* Phone illustration */}
          <View
            style={{
              width: 50,
              height: 70,
              backgroundColor: Colors.white + "20",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 28 }}>📱</Text>
            <View style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.secondary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: Colors.white }}>1</Text>
            </View>
          </View>
        </View>

        {/* ── Notification Groups ── */}
        {NOTIFICATIONS.map((group) => (
          <View key={group.section} style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.muted, marginBottom: 4 }}>
              {group.section}
            </Text>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 16,
                paddingHorizontal: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {group.items.map((item) => (
                <NotifCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        ))}

        {/* ── Settings Banner ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            backgroundColor: Colors.surface,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.dark }}>Not getting notifications?</Text>
            <Text style={{ fontSize: 12, color: Colors.muted }}>Check your notification settings to make sure you don't miss any important updates.</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: "700" }}>Open Settings</Text>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18L15 12L9 6" stroke="white" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
