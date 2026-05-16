import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";
import { Colors } from "../constants/colors";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { useAppStore } from "../stores/appStore";
import type { MedicationReminder, Appointment } from "../stores/appStore";

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
  enabled?: boolean;
}



function ReminderCard({ item, completed = false, onDotsPress }: { key?: React.Key; item: Reminder; completed?: boolean; onDotsPress?: () => void }) {
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
          <TouchableOpacity onPress={onDotsPress}>
            <DotsIcon size={18} color={Colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function RemindersScreen() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newFrequency, setNewFrequency] = useState("");
  const [newTime, setNewTime] = useState("");

  const medicationReminders = useAppStore((s) => s.medicationReminders);
  const toggleReminder = useAppStore((s) => s.toggleReminder);
  const deleteReminder = useAppStore((s) => s.deleteReminder);
  const addReminder = useAppStore((s) => s.addReminder);
  const appointments = useAppStore((s) => s.appointments);

  const handleAddReminder = () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert("Name required", "Please enter a medication name.");
      return;
    }
    addReminder({
      name,
      dosage: newDosage.trim() || "1 tablet",
      frequency: newFrequency.trim() || "Once daily",
      time: newTime.trim() || "08:00 AM",
      enabled: true,
      nextDue: `Today • ${newTime.trim() || "08:00 AM"}`,
    });
    setNewName("");
    setNewDosage("");
    setNewFrequency("");
    setNewTime("");
    setShowAddModal(false);
  };

  // Build unified reminder list from store
  const allReminders = useMemo(() => {
    const medItems: Reminder[] = medicationReminders.map((r: MedicationReminder) => ({
      id: r.id,
      type: "medication" as ReminderType,
      typeLabel: "Medication",
      title: r.name,
      subtitle: `${r.dosage} • ${r.frequency}`,
      time: r.nextDue,
      badge: r.enabled ? "Active" : "Paused",
      badgeColor: r.enabled ? Colors.secondary : Colors.muted,
      badgeBg: r.enabled ? Colors.secondaryLight : Colors.surface,
      icon: "💊",
      iconBg: r.enabled ? Colors.secondaryLight : Colors.surface,
      enabled: r.enabled,
    }));

    const apptItems: Reminder[] = appointments
      .filter((a: Appointment) => a.status === "upcoming")
      .map((a: Appointment) => ({
        id: a.id,
        type: "appointment" as ReminderType,
        typeLabel: "Appointment",
        title: a.clinicName,
        subtitle: a.service,
        time: `${a.date} • ${a.time}`,
        badge: "Upcoming",
        badgeColor: Colors.primary,
        badgeBg: Colors.primaryLight,
        icon: "📅",
        iconBg: Colors.primaryLight,
        enabled: true,
      }));

    return [...medItems, ...apptItems];
  }, [medicationReminders, appointments]);

  const activeReminders = allReminders.filter((r: Reminder) => r.enabled !== false);
  const pausedReminders = allReminders.filter((r: Reminder) => r.enabled === false);

  const filterReminders = (items: Reminder[]) => {
    if (activeFilter === "all") return items;
    if (activeFilter === "medications") return items.filter((r) => r.type === "medication");
    if (activeFilter === "appointments") return items.filter((r) => r.type === "appointment");
    if (activeFilter === "health") return items.filter((r) => r.type === "health");
    return items;
  };

  const handleDotsPress = (item: Reminder) => {
    if (item.type !== "medication") return;
    Alert.alert(
      item.title,
      "What would you like to do?",
      [
        {
          text: item.enabled ? "Pause reminder" : "Enable reminder",
          onPress: () => toggleReminder(item.id),
        },
        {
          text: "Delete reminder",
          style: "destructive",
          onPress: () =>
            Alert.alert("Delete reminder?", `Remove "${item.title}"?`, [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => deleteReminder(item.id) },
            ]),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const visibleActive = filterReminders(activeReminders);
  const visiblePaused = filterReminders(pausedReminders);

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
            onPress={() => setShowAddModal(true)}
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
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>
              Active reminders {visibleActive.length > 0 && `(${visibleActive.length})`}
            </Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View all</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {visibleActive.length === 0 ? (
            <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 24, alignItems: "center" }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>🔔</Text>
              <Text style={{ fontSize: 14, color: Colors.muted, textAlign: "center" }}>No active reminders.</Text>
            </View>
          ) : (
            visibleActive.map((item) => (
              <ReminderCard key={item.id} item={item} onDotsPress={() => handleDotsPress(item)} />
            ))
          )}
        </View>

        {/* ── Paused / Disabled Reminders ── */}
        {visiblePaused.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Paused reminders</Text>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View history</Text>
                <ChevronRightIcon size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            {visiblePaused.map((item) => (
              <ReminderCard key={item.id} item={item} completed onDotsPress={() => handleDotsPress(item)} />
            ))}
          </View>
        )}

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

      {/* ── Add Reminder Modal ── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 36,
            }}
          >
            {/* Handle */}
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: "center", marginBottom: 20 }} />

            <Text style={{ fontSize: 18, fontWeight: "800", color: Colors.dark, marginBottom: 4 }}>
              Add medication reminder 💊
            </Text>
            <Text style={{ fontSize: 13, color: Colors.muted, marginBottom: 20 }}>
              We'll remind you to take your medication on time.
            </Text>

            {/* Medication name */}
            <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>
              Medication name *
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Paracetamol 500mg"
              placeholderTextColor={Colors.muted}
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: Colors.dark,
                borderWidth: 1,
                borderColor: Colors.border,
                marginBottom: 12,
              }}
            />

            {/* Dosage + Frequency row */}
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>Dosage</Text>
                <TextInput
                  value={newDosage}
                  onChangeText={setNewDosage}
                  placeholder="e.g. 1 tablet"
                  placeholderTextColor={Colors.muted}
                  style={{
                    backgroundColor: Colors.surface,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    color: Colors.dark,
                    borderWidth: 1,
                    borderColor: Colors.border,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>Frequency</Text>
                <TextInput
                  value={newFrequency}
                  onChangeText={setNewFrequency}
                  placeholder="e.g. After breakfast"
                  placeholderTextColor={Colors.muted}
                  style={{
                    backgroundColor: Colors.surface,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    color: Colors.dark,
                    borderWidth: 1,
                    borderColor: Colors.border,
                  }}
                />
              </View>
            </View>

            {/* Time */}
            <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>
              Reminder time
            </Text>
            <TextInput
              value={newTime}
              onChangeText={setNewTime}
              placeholder="e.g. 08:00 AM"
              placeholderTextColor={Colors.muted}
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                color: Colors.dark,
                borderWidth: 1,
                borderColor: Colors.border,
                marginBottom: 20,
              }}
            />

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                  backgroundColor: Colors.surface,
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.muted }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddReminder}
                style={{
                  flex: 2,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                  backgroundColor: Colors.primary,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.white }}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
