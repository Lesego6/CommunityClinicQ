import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { useAppStore } from "../../stores/appStore";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    emoji: "🏥",
    title: "Skip the Queue,\nNot the Care",
    subtitle: "Join clinic queues remotely and get notified when it's your turn. No more waiting in long lines.",
    bg: Colors.primaryLight,
    accent: Colors.primary,
  },
  {
    emoji: "💊",
    title: "Find Your\nMedication Nearby",
    subtitle: "Check which clinics have your medication in stock before you travel. Save time and frustration.",
    bg: Colors.tealLight,
    accent: Colors.teal,
  },
  {
    emoji: "📅",
    title: "Book Appointments\nWith Ease",
    subtitle: "Schedule clinic visits in advance, get reminders, and manage your health calendar all in one place.",
    bg: Colors.yellowLight,
    accent: Colors.warning,
  },
  {
    emoji: "🚨",
    title: "Emergency Help\nWhen You Need It",
    subtitle: "Quick access to emergency numbers, nearest hospitals, and the ability to share your location instantly.",
    bg: Colors.redLight,
    accent: Colors.danger,
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      router.replace("/onboarding/tutorial");
    }
  };

  const skip = () => {
    completeOnboarding();
    router.replace("/auth/phone");
  };

  const slide = SLIDES[currentSlide];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={["top", "bottom"]}>
      {/* Skip button */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 20, paddingTop: 8 }}>
        <TouchableOpacity onPress={skip} style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.muted }}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={{ width, flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
            {/* Illustration */}
            <View style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: s.bg, alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
              <Text style={{ fontSize: 80 }}>{s.emoji}</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: "900", color: Colors.dark, textAlign: "center", lineHeight: 36, marginBottom: 16 }}>
              {s.title}
            </Text>
            <Text style={{ fontSize: 15, color: Colors.muted, textAlign: "center", lineHeight: 22 }}>
              {s.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === currentSlide ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === currentSlide ? Colors.primary : Colors.border,
            }}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32, gap: 12 }}>
        <TouchableOpacity
          onPress={goNext}
          style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
        >
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700" }}>
            {currentSlide < SLIDES.length - 1 ? "Next" : "Get Started"}
          </Text>
        </TouchableOpacity>
        {currentSlide === SLIDES.length - 1 && (
          <TouchableOpacity onPress={skip} style={{ alignItems: "center", paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: Colors.muted }}>I'll explore on my own</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
