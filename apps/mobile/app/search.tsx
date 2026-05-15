import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../constants/colors";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { CLINICS, CLINIC_IMAGES } from "../constants/clinics";

// ─── Icons ───────────────────────────────────────────────────────────────────

function SearchIcon({ size = 18, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} />
      <Path d="M16.5 16.5L21 21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function XIcon({ size = 18, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronDownIcon({ size = 16, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronUpIcon({ size = 16, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 15L12 9L6 15" stroke={color} strokeWidth={2} strokeLinecap="round" />
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

function LocationIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={9} r={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function StarIcon({ size = 12, color = Colors.yellow }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
    </Svg>
  );
}

function BookmarkIcon({ size = 18, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function PeopleIcon({ color = Colors.busy, size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={3} stroke={color} strokeWidth={2} />
      <Path d="M3 20C3 17.2386 5.68629 15 9 15C12.3137 15 15 17.2386 15 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={17} cy={7} r={2.5} stroke={color} strokeWidth={1.5} />
      <Path d="M21 20C21 18.3431 19.2091 17 17 17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ label, value }: { label: string; value: string }) {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 6,
      }}
    >
      <Text style={{ fontSize: 13, color: Colors.dark, flex: 1 }} numberOfLines={1}>{value}</Text>
      <ChevronDownIcon size={14} color={Colors.muted} />
    </TouchableOpacity>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: active ? Colors.primary : Colors.white,
        borderWidth: 1,
        borderColor: active ? Colors.primary : Colors.border,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: active ? "600" : "400", color: active ? Colors.white : Colors.dark }}>
        {label}
      </Text>
      {active && (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <Path d="M20 6L9 17L4 12" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
    </TouchableOpacity>
  );
}

// ─── Radio Chip ───────────────────────────────────────────────────────────────

function RadioChip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: active ? Colors.primaryLight : Colors.white,
        borderWidth: 1,
        borderColor: active ? Colors.primary : Colors.border,
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: active ? Colors.primary : Colors.border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {active && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary }} />}
      </View>
      <Text style={{ fontSize: 13, color: active ? Colors.primary : Colors.dark }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Clinic Result Card ───────────────────────────────────────────────────────

// CLINIC_IMAGES and CLINICS are imported from constants/clinics

function ResultCard({ item, onPress }: { item: typeof CLINICS[0]; onPress: () => void }) {
  const trafficColor = item.trafficLevel === "busy" ? Colors.busy : item.trafficLevel === "moderate" ? Colors.moderate : Colors.low;
  const waitBg = item.trafficLevel === "busy" ? "#FFF3E0" : item.trafficLevel === "moderate" ? "#FFFDE7" : Colors.primaryLight;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Open badge */}
      <View style={{ position: "absolute", top: 12, left: 12, zIndex: 1, backgroundColor: Colors.success, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ fontSize: 10, fontWeight: "700", color: Colors.white }}>OPEN</Text>
      </View>

      <View style={{ flexDirection: "row", padding: 12, gap: 12 }}>
        <Image
          source={{ uri: CLINIC_IMAGES[item.imageIndex % CLINIC_IMAGES.length] }}
          style={{ width: 80, height: 80, borderRadius: 12 }}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.primary, flex: 1 }}>{item.name}</Text>
            <View style={{ alignItems: "flex-end" }}>
              <View style={{ backgroundColor: waitBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 10, color: Colors.muted }}>Est. wait time</Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.primary }}>{item.waitTime}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                <PeopleIcon color={trafficColor} size={12} />
                <Text style={{ fontSize: 11, fontWeight: "600", color: trafficColor }}>
                  {item.trafficLevel === "busy" ? "Busy" : item.trafficLevel === "moderate" ? "Moderate" : "Low"}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <LocationIcon size={11} color={Colors.muted} />
            <Text style={{ fontSize: 11, color: Colors.muted }}>{item.distance} • {item.area}</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {item.services.map((tag) => (
              <View key={tag} style={{ backgroundColor: Colors.surface, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.border }}>
                <Text style={{ fontSize: 10, color: Colors.muted }}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
            <StarIcon size={12} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.dark }}>{item.rating}</Text>
            <Text style={{ fontSize: 11, color: Colors.muted }}>({item.reviews})</Text>
            <Text style={{ fontSize: 11, color: Colors.muted }}>|</Text>
            <Text style={{ fontSize: 11, color: Colors.success, fontWeight: "600" }}>Open</Text>
            <Text style={{ fontSize: 11, color: Colors.muted }}>• Closes 16:00</Text>
          </View>
        </View>
        <TouchableOpacity style={{ justifyContent: "flex-start", paddingTop: 4 }}>
          <BookmarkIcon size={18} color={Colors.muted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);  const [activeService, setActiveService] = useState("All Services");
  const [activeFacility, setActiveFacility] = useState("Pharmacy");
  const [activeLanguage, setActiveLanguage] = useState("All Languages");
  const [activeRating, setActiveRating] = useState("Any rating");

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
        <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.dark }}>Search & Filters</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Reset all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ── Search Bar ── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.white,
            marginHorizontal: 20,
            marginTop: 16,
            borderRadius: 28,
            paddingHorizontal: 16,
            paddingVertical: 13,
            gap: 10,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <SearchIcon size={18} color={Colors.muted} />
          <TextInput
            placeholder="Search clinics, services, locations..."
            placeholderTextColor={Colors.muted}
            style={{ flex: 1, fontSize: 14, color: Colors.dark }}
          />
          <TouchableOpacity>
            <XIcon size={18} color={Colors.muted} />
          </TouchableOpacity>
        </View>

        {/* ── Filters Section ── */}
        <View
          style={{
            backgroundColor: Colors.white,
            marginHorizontal: 20,
            marginTop: 12,
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
            <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>Filters</Text>
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>
                {showFilters ? "Hide filters" : "Show filters"}
              </Text>
              {showFilters ? <ChevronUpIcon size={14} color={Colors.primary} /> : <ChevronDownIcon size={14} color={Colors.primary} />}
            </TouchableOpacity>
          </View>

          {showFilters && (
            <>
              {/* Sort by + Distance */}
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>Sort by</Text>
                  <FilterDropdown label="Sort by" value="Nearest" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>Distance</Text>
                  <FilterDropdown label="Distance" value="Within 10 km" />
                </View>
              </View>

              {/* Clinic status + Wait time */}
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>Clinic status</Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: Colors.border,
                      gap: 6,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
                      <Text style={{ fontSize: 13, color: Colors.dark }}>Open now</Text>
                    </View>
                    <ChevronDownIcon size={14} color={Colors.muted} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>Wait time</Text>
                  <FilterDropdown label="Wait time" value="Any wait time" />
                </View>
              </View>

              {/* Services */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 8 }}>Services</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {["All Services", "General Services", "Chronic Care", "Maternal Care"].map((s) => (
                    <Chip key={s} label={s} active={activeService === s} onPress={() => setActiveService(s)} />
                  ))}
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Colors.border }}>
                    <Text style={{ fontSize: 13, color: Colors.dark }}>More</Text>
                    <ChevronDownIcon size={12} color={Colors.muted} />
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Facilities */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 8 }}>Facilities</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {["Pharmacy", "Wheelchair Access", "Laboratory", "Parking"].map((f) => (
                    <RadioChip key={f} label={f} active={activeFacility === f} onPress={() => setActiveFacility(f)} />
                  ))}
                </ScrollView>
              </View>

              {/* Medication availability */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 6 }}>Medication availability</Text>
                <FilterDropdown label="Medication" value="Any medication" />
              </View>

              {/* Languages */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 8 }}>Languages</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {["All Languages", "isiZulu", "isiXhosa", "Afrikaans", "English"].map((l) => (
                    <Chip key={l} label={l} active={activeLanguage === l} onPress={() => setActiveLanguage(l)} />
                  ))}
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Colors.border }}>
                    <Text style={{ fontSize: 13, color: Colors.dark }}>More</Text>
                    <ChevronDownIcon size={12} color={Colors.muted} />
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Location */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 8 }}>Location</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: Colors.primaryLight,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <LocationIcon size={14} color={Colors.primary} />
                    <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Use my current location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: Colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: Colors.dark }}>🗺 Select on map</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Rating */}
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.muted, marginBottom: 8 }}>Rating</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {["Any rating", "4★ & above", "3★ & above", "2★ & above", "1★ & above"].map((r) => (
                    <Chip key={r} label={r} active={activeRating === r} onPress={() => setActiveRating(r)} />
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </View>

        {/* ── Apply Filters Button ── */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            marginHorizontal: 20,
            marginTop: 16,
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.white, fontSize: 15, fontWeight: "700" }}>Apply Filters (24 results)</Text>
        </TouchableOpacity>

        {/* ── Results ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.dark }}>24 clinics found</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, color: Colors.muted }}>Sort by: Nearest</Text>
              <ChevronDownIcon size={14} color={Colors.muted} />
            </TouchableOpacity>
          </View>
          {RESULTS.map((item) => (
            <ResultCard
              key={item.id}
              item={item}
              onPress={() => router.push(`/clinic/${item.id}` as any)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
