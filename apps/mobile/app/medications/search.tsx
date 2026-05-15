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
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { CLINIC_IMAGES, MEDICATION_NEARBY_RESULTS } from "../../constants/clinics";

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

function ChevronDownIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronUpIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
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

function LocationIcon({ size = 12, color = Colors.muted }: { size?: number; color?: string }) {
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

function PillIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.5 3.5C8.01472 3.5 6 5.51472 6 8V16C6 18.4853 8.01472 20.5 10.5 20.5C12.9853 20.5 15 18.4853 15 16V8C15 5.51472 12.9853 3.5 10.5 3.5Z" stroke={color} strokeWidth={2} />
      <Path d="M6 12H15" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ value }: { value: string }) {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 4,
      }}
    >
      <Text style={{ fontSize: 12, color: Colors.dark, flex: 1 }} numberOfLines={1}>{value}</Text>
      <ChevronDownIcon size={12} color={Colors.muted} />
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
      <Text style={{ fontSize: 12, fontWeight: active ? "600" : "400", color: active ? Colors.white : Colors.dark }}>
        {label}
      </Text>
      {active && (
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
          <Path d="M20 6L9 17L4 12" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
    </TouchableOpacity>
  );
}

// ─── Medication Result Card ───────────────────────────────────────────────────

const MED_IMAGES = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&q=80",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=120&q=80",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=120&q=80",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&q=80",
];

const MEDICATIONS = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Pain reliever • Fever reducer",
    form: "Tablet",
    generic: "Paracetamol",
    clinics: "8 clinics near you",
    price: "R2.50",
    rating: 4.7,
    reviews: 128,
    status: "in-stock" as const,
    imageIndex: 0,
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    category: "Antibiotic • Bacterial infections",
    form: "Capsule",
    generic: "Amoxicillin",
    clinics: "6 clinics near you",
    price: "R6.00",
    rating: 4.6,
    reviews: 98,
    status: "in-stock" as const,
    imageIndex: 1,
  },
  {
    id: "3",
    name: "Metformin 500mg",
    category: "Diabetes • High blood sugar",
    form: "Tablet",
    generic: "Metformin",
    clinics: "3 clinics near you",
    price: "R3.20",
    rating: 4.5,
    reviews: 76,
    status: "low-stock" as const,
    imageIndex: 2,
  },
  {
    id: "4",
    name: "Ibuprofen 400mg",
    category: "Pain reliever • Anti-inflammatory",
    form: "Tablet",
    generic: "Ibuprofen",
    clinics: "5 clinics near you",
    price: "R3.80",
    rating: 4.4,
    reviews: 64,
    status: "in-stock" as const,
    imageIndex: 3,
  },
];

function StockBadge({ status }: { status: "in-stock" | "low-stock" | "out-of-stock" }) {
  const config = {
    "in-stock": { bg: Colors.primaryLight, color: Colors.success, label: "In stock" },
    "low-stock": { bg: Colors.yellowLight, color: Colors.warning, label: "Low stock" },
    "out-of-stock": { bg: Colors.redLight, color: Colors.danger, label: "Out of stock" },
  }[status];

  return (
    <View style={{ backgroundColor: config.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: config.color }}>{config.label}</Text>
    </View>
  );
}

function MedCard({ item }: { item: typeof MEDICATIONS[0] }) {
  return (
    <TouchableOpacity
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
      <View style={{ flexDirection: "row", padding: 14, gap: 12 }}>
        {/* Stock badge + image */}
        <View style={{ alignItems: "center", gap: 6 }}>
          <StockBadge status={item.status} />
          <Image
            source={{ uri: MED_IMAGES[item.imageIndex] }}
            style={{ width: 70, height: 60, borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: Colors.muted, marginTop: 2 }}>{item.category}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.primary }}>{item.form}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: Colors.muted, marginTop: 4 }}>Generic: {item.generic}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <LocationIcon size={11} color={Colors.muted} />
            <Text style={{ fontSize: 11, color: Colors.muted }}>{item.clinics}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <StarIcon size={11} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.dark }}>{item.rating}</Text>
            <Text style={{ fontSize: 11, color: Colors.muted }}>({item.reviews})</Text>
          </View>
        </View>

        {/* Price + chevron */}
        <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 10, color: Colors.muted }}>From</Text>
            <Text style={{ fontSize: 16, fontWeight: "800", color: Colors.primary }}>{item.price}</Text>
          </View>
          <ChevronRightIcon size={16} color={Colors.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function MedicationsSearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [activeCondition, setActiveCondition] = useState("All Conditions");
  const [activeLanguage, setActiveLanguage] = useState("All Languages");

  // Filter the static medication list by search query
  const filteredMedications = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MEDICATIONS;
    return MEDICATIONS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q)
    );
  }, [search]);

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
        <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.dark }}>Search Medications</Text>
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
            value={search}
            onChangeText={setSearch}
            placeholder="Search medication name, condition or brand..."
            placeholderTextColor={Colors.muted}
            style={{ flex: 1, fontSize: 14, color: Colors.dark }}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <XIcon size={18} color={Colors.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filters ── */}
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <PillIcon size={16} color={Colors.primary} />
              <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark }}>Filters</Text>
            </View>
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
              {/* Row 1 */}
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Sort by</Text>
                  <FilterDropdown value="Availability" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Availability</Text>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 9,
                      borderWidth: 1,
                      borderColor: Colors.border,
                      gap: 4,
                    }}
                  >
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success }} />
                    <Text style={{ fontSize: 12, color: Colors.dark, flex: 1 }}>In stock only</Text>
                    <ChevronDownIcon size={12} color={Colors.muted} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Location</Text>
                  <FilterDropdown value="My location (10 km)" />
                </View>
              </View>

              {/* Row 2 */}
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Medication type</Text>
                  <FilterDropdown value="All types" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Form</Text>
                  <FilterDropdown value="All forms" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Prescription</Text>
                  <FilterDropdown value="Any" />
                </View>
              </View>

              {/* Condition */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 8 }}>Condition (Optional)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {["All Conditions", "Pain", "Diabetes", "Hypertension", "Infection"].map((c) => (
                    <Chip key={c} label={c} active={activeCondition === c} onPress={() => setActiveCondition(c)} />
                  ))}
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Colors.border }}>
                    <Text style={{ fontSize: 12, color: Colors.dark }}>More</Text>
                    <ChevronDownIcon size={12} color={Colors.muted} />
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Pharmaceutical class */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Pharmaceutical class</Text>
                <FilterDropdown value="All classes" />
              </View>

              {/* Row 3 */}
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Price range</Text>
                  <FilterDropdown value="Any price" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 5 }}>Generic / Brand</Text>
                  <FilterDropdown value="Any" />
                </View>
              </View>

              {/* Language */}
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: Colors.muted, marginBottom: 8 }}>Language</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {["All Languages", "isiZulu", "isiXhosa", "Afrikaans", "English"].map((l) => (
                    <Chip key={l} label={l} active={activeLanguage === l} onPress={() => setActiveLanguage(l)} />
                  ))}
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Colors.border }}>
                    <Text style={{ fontSize: 12, color: Colors.dark }}>More</Text>
                    <ChevronDownIcon size={12} color={Colors.muted} />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </>
          )}
        </View>

        {/* ── Apply Filters ── */}
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
          <Text style={{ color: Colors.white, fontSize: 15, fontWeight: "700" }}>Apply Filters</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 12, color: Colors.muted, marginTop: 8 }}>
          {filteredMedications.length} medication{filteredMedications.length !== 1 ? "s" : ""} found
        </Text>

        {/* ── Results ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          {filteredMedications.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>💊</Text>
              <Text style={{ fontSize: 14, color: Colors.muted, textAlign: "center" }}>
                No medications match "{search}"
              </Text>
            </View>
          ) : (
            filteredMedications.map((item) => (
              <MedCard key={item.id} item={item} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
