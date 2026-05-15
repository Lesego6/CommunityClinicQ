import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";

const STEPS = [
  {
    step: 1,
    emoji: "📍",
    title: "Find a Nearby Clinic",
    desc: "Open the Nearby tab to see clinics close to you. Each clinic shows real-time queue status and estimated wait times.",
    tip: "Tap any clinic card to see full details, services, and operating hours.",
  },
  {
    step: 2,
    emoji: "🎫",
    title: "Join the Queue Remotely",
    desc: "Tap 'Join Queue' on any clinic page. Select your service type and confirm. You'll get a digital ticket with a QR code.",
    tip: "You can join the queue from home and only travel when it's almost your turn.",
  },
  {
    step: 3,
    emoji: "🔔",
    title: "Get Notified",
    desc: "We'll send you push notifications as you move up in the queue. You'll be alerted when you're 5 people away.",
    tip: "Make sure notifications are enabled for the best experience.",
  },
  {
    step: 4,
    emoji: "📱",
    title: "Check In at the Clinic",
    desc: "When you arrive, show your QR code at the reception or kiosk. Scan to confirm your arrival and secure your spot.",
    tip: "Your QR code refreshes automatically for security.",
  },
  {
    step: 5,
    emoji: "💊",
    title: "Manage Medications",
    desc: "Search for medications and see which clinics have them in stock. Set reminders so you never miss a dose.",
    tip: "Enable stock alerts to be notified when your medication is available.",
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const goNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      router.replace("/onboarding/permissions");
    }
  };

  const step = STEPS[activeStep];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <ClinicQLogo size={28} />
        <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>How it works</Text>
        <TouchableOpacity onPress={() => router.replace("/onboarding/permissions")}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.muted }}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Step indicator */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i <= activeStep ? Colors.primary : Colors.border,
              }}
            />
          ))}
        </View>

        {/* Step content */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 24, padding: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 48 }}>{step.emoji}</Text>
          </View>
          <View style={{ backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.white }}>Step {step.step} of {STEPS.length}</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: Colors.dark, textAlign: "center", marginBottom: 12 }}>{step.title}</Text>
          <Text style={{ fontSize: 14, color: Colors.muted, textAlign: "center", lineHeight: 21 }}>{step.desc}</Text>
        </View>

        {/* Tip */}
        <View style={{ backgroundColor: Colors.yellowLight, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <Text style={{ fontSize: 18 }}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.warning }}>Pro tip</Text>
            <Text style={{ fontSize: 12, color: Colors.darkMid, marginTop: 2, lineHeight: 18 }}>{step.tip}</Text>
          </View>
        </View>

        {/* Step list */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}>
          {STEPS.map((s, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveStep(i)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: i < STEPS.length - 1 ? 1 : 0, borderBottomColor: Colors.border }}
            >
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: i <= activeStep ? Colors.primary : Colors.border, alignItems: "center", justifyContent: "center" }}>
                {i < activeStep ? (
                  <Text style={{ color: Colors.white, fontSize: 14 }}>✓</Text>
                ) : (
                  <Text style={{ fontSize: 14 }}>{s.emoji}</Text>
                )}
              </View>
              <Text style={{ flex: 1, fontSize: 13, fontWeight: i === activeStep ? "700" : "400", color: i === activeStep ? Colors.primary : Colors.dark }}>
                {s.title}
              </Text>
              {i === activeStep && (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12, gap: 10 }}>
        <TouchableOpacity
          onPress={goNext}
          style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
        >
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>
            {activeStep < STEPS.length - 1 ? "Next Step" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
