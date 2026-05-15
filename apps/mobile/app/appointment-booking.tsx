import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../constants/colors";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { useAppStore } from "../stores/appStore";
import { CLINICS } from "../constants/clinics";

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

function LocationIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={9} r={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function CalendarIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={18} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M3 9H21M8 2V6M16 2V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ClockIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
      <Path d="M12 7V12L15 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function HourglassIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 2H19M5 22H19M6 2C6 8 12 12 12 12C12 12 18 8 18 2M6 22C6 16 12 12 12 12C12 12 18 16 18 22" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function RefreshIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 4V10H17M1 20V14H7M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MessageIcon({ size = 18, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function CheckIcon({ size = 16, color = Colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current = 1 }: { current?: number }) {
  const steps = ["Select Clinic", "Choose Service", "Select Date & Time", "Confirm"];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: i < current ? Colors.primary : i === current - 1 ? Colors.primary : Colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i < current - 1 ? (
                <CheckIcon size={12} color={Colors.white} />
              ) : (
                <Text style={{ fontSize: 11, fontWeight: "700", color: i === current - 1 ? Colors.white : Colors.muted }}>
                  {i + 1}
                </Text>
              )}
            </View>
          </View>
          {i < steps.length - 1 && (
            <View style={{ flex: 1, height: 2, backgroundColor: i < current - 1 ? Colors.primary : Colors.border, marginHorizontal: 4 }} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "general", label: "General Consultation", duration: "15 min", icon: "🩺", active: true },
  { id: "chronic", label: "Chronic Care", duration: "20 min", icon: "💗", active: false },
  { id: "maternal", label: "Maternal Health", duration: "20 min", icon: "🤱", active: false },
  { id: "immunization", label: "Immunization", duration: "15 min", icon: "💉", active: false },
  { id: "more", label: "More", duration: "", icon: "⋯", active: false },
];

function ServiceCard({ service, onPress }: { service: typeof SERVICES[0]; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        width: 80,
        padding: 10,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: service.active ? Colors.primary : Colors.border,
        backgroundColor: service.active ? Colors.primaryLight : Colors.white,
        position: "relative",
      }}
    >
      {service.active && (
        <View
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: Colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckIcon size={10} color={Colors.white} />
        </View>
      )}
      <Text style={{ fontSize: 24, marginBottom: 4 }}>{service.icon}</Text>
      <Text style={{ fontSize: 11, fontWeight: "600", color: service.active ? Colors.primary : Colors.dark, textAlign: "center" }}>
        {service.label}
      </Text>
      {service.duration ? (
        <Text style={{ fontSize: 10, color: Colors.muted, marginTop: 2 }}>{service.duration}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

// ─── Date Selector ────────────────────────────────────────────────────────────

const DATES = [
  { day: "Today\nFri", date: "24 May", active: true },
  { day: "Sat", date: "25 May", active: false },
  { day: "Sun", date: "26 May", active: false },
  { day: "Mon", date: "27 May", active: false },
  { day: "Tue", date: "28 May", active: false },
  { day: "Wed", date: "29 May", active: false },
  { day: "Thu", date: "30 May", active: false },
];

const TIME_SLOTS = [
  ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM"],
  ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
  ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"],
  ["04:00 PM", "04:30 PM"],
];

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AppointmentBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ clinicId?: string; clinicName?: string }>();
  const addAppointment = useAppStore((s) => s.addAppointment);

  // Allow pre-selecting a clinic via route params (e.g. from clinic detail screen)
  const defaultClinicId = params.clinicId ?? "langa-community";
  const defaultClinicName =
    params.clinicName ??
    CLINICS.find((c) => c.id === defaultClinicId)?.name ??
    "Langa Community Clinic";

  const [selectedClinicId] = useState(defaultClinicId);
  const [selectedClinicName] = useState(defaultClinicName);
  const [selectedService, setSelectedService] = useState("general");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("09:00 AM");
  const [smsReminder, setSmsReminder] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const selectedServiceLabel =
    SERVICES.find((s) => s.id === selectedService)?.label ?? "General Consultation";
  const selectedServiceDuration =
    SERVICES.find((s) => s.id === selectedService)?.duration ?? "15 min";
  const selectedDateLabel = DATES[selectedDate];

  const handleConfirm = () => {
    const appt = addAppointment({
      clinicId: selectedClinicId,
      clinicName: selectedClinicName,
      service: selectedServiceLabel,
      date: `${selectedDateLabel.day.replace(/\n/g, " ")}, ${selectedDateLabel.date} 2026`,
      time: selectedTime,
      duration: selectedServiceDuration,
      status: "upcoming",
      doctor: "Dr. N. Dlamini",
    });

    Alert.alert(
      "Appointment confirmed! 🎉",
      `${selectedServiceLabel} at ${selectedClinicName}\n${selectedDateLabel.date} • ${selectedTime}`,
      [
        {
          text: "View appointments",
          onPress: () => router.replace("/(tabs)/appointments" as any),
        },
        { text: "Done", onPress: () => router.back() },
      ]
    );
  };

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
        <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.dark }}>Appointment Booking</Text>
        <TouchableOpacity>
          <BellIcon size={22} hasDot />
        </TouchableOpacity>
      </View>

      {/* Step indicator */}
      <StepIndicator current={2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* ── Clinic selector ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <LocationIcon size={16} color={Colors.primary} />
          <Text style={{ flex: 1, fontSize: 14, fontWeight: "600", color: Colors.dark }}>Langa Community Clinic</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* ── Select Service ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Select Service</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>View services</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {SERVICES.map((s) => (
              <ServiceCard
                key={s.id}
                service={{ ...s, active: selectedService === s.id }}
                onPress={() => setSelectedService(s.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Choose Date & Time ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Choose Date & Time</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <CalendarIcon size={14} color={Colors.primary} />
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Calendar view</Text>
            </TouchableOpacity>
          </View>

          {/* Date row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
            {DATES.map((d, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedDate(i)}
                style={{
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: selectedDate === i ? Colors.primary : Colors.surface,
                  borderWidth: 1,
                  borderColor: selectedDate === i ? Colors.primary : Colors.border,
                  minWidth: 60,
                }}
              >
                <Text style={{ fontSize: 10, color: selectedDate === i ? Colors.white : Colors.muted, textAlign: "center" }}>
                  {d.day}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: selectedDate === i ? Colors.white : Colors.dark, marginTop: 2 }}>
                  {d.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time slots */}
          {TIME_SLOTS.map((row, ri) => (
            <View key={ri} style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              {row.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: selectedTime === time ? Colors.primary : Colors.surface,
                    borderWidth: 1,
                    borderColor: selectedTime === time ? Colors.primary : Colors.border,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "600", color: selectedTime === time ? Colors.white : Colors.dark }}>
                    {time}
                  </Text>
                  {selectedTime === time && <CheckIcon size={12} color={Colors.white} />}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* ── Your Appointment ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <CalendarIcon size={18} color={Colors.primary} />
              <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>Your Appointment</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <RefreshIcon size={14} color={Colors.primary} />
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Reschedule</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark }}>{selectedClinicName}</Text>
          <Text style={{ fontSize: 13, color: Colors.muted, marginBottom: 10 }}>{selectedServiceLabel}</Text>
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <CalendarIcon size={14} color={Colors.muted} />
              <Text style={{ fontSize: 13, color: Colors.muted }}>
                {selectedDateLabel.day.replace(/\n/g, " ")}, {selectedDateLabel.date} 2026
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ClockIcon size={14} color={Colors.muted} />
              <Text style={{ fontSize: 13, color: Colors.muted }}>{selectedTime}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <HourglassIcon size={14} color={Colors.muted} />
              <Text style={{ fontSize: 13, color: Colors.muted }}>{selectedServiceDuration}</Text>
            </View>
          </View>
        </View>

        {/* ── Get Reminders ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 4 }}>Get reminders</Text>
          <Text style={{ fontSize: 13, color: Colors.muted, marginBottom: 16 }}>We'll remind you before your appointment</Text>

          {/* SMS Reminder */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <MessageIcon size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark }}>SMS Reminder</Text>
              <Text style={{ fontSize: 12, color: Colors.muted }}>Get an SMS reminder</Text>
            </View>
            <Switch
              value={smsReminder}
              onValueChange={setSmsReminder}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Push Notification */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" fill={Colors.primary} />
                <Path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18H20L18 16Z" stroke={Colors.primary} strokeWidth={2} fill="none" />
              </Svg>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark }}>Push Notification</Text>
              <Text style={{ fontSize: 12, color: Colors.muted }}>Get a push notification</Text>
            </View>
            <Switch
              value={pushNotif}
              onValueChange={setPushNotif}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Add to Calendar */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <CalendarIcon size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark }}>Add to Calendar</Text>
              <Text style={{ fontSize: 12, color: Colors.muted }}>Sync to your calendar</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryLight,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Add</Text>
              <Text style={{ fontSize: 16 }}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Important Notice ── */}
        <View
          style={{
            backgroundColor: Colors.yellowLight,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>📞</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.warning }}>Important</Text>
            <Text style={{ fontSize: 12, color: Colors.darkMid, marginTop: 2 }}>
              Please arrive 15 minutes before your appointment time.
            </Text>
          </View>
        </View>

        {/* ── Confirm Button ── */}
        <TouchableOpacity
          onPress={handleConfirm}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>Confirm Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
