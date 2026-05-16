import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import {
  BellWithDot,
  ChevronRightIcon,
  CloseIcon,
  FilterIcon,
  LocationIcon,
  PillIcon,
  SearchIcon,
} from "../../components/ui/Icons";
import { useAppStore } from "../../stores/appStore";
import {
  CLINIC_IMAGES,
  MEDICATION_NEARBY_RESULTS,
  type MedicationClinicResult,
} from "../../constants/clinics";
import { getBottomPadding, navigateWithBlur } from "../../utils/ui";

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All", icon: "⊞" },
  { id: "pain", label: "Pain Relief", icon: "🧍" },
  { id: "antibiotics", label: "Antibiotics", icon: "🛡" },
  { id: "chronic", label: "Chronic Care", icon: "💗" },
  { id: "vitamins", label: "Vitamins", icon: "💊" },
];

function CategoryTab({
  item,
  active,
  onPress,
}: {
  item: (typeof CATEGORIES)[0];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.categoryTab, active && styles.categoryTabActive]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${item.label} category`}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
        {item.label}
      </Text>
      {active && <View style={styles.categoryDot} />}
    </TouchableOpacity>
  );
}

// ─── Recent Search Tag ────────────────────────────────────────────────────────

function SearchTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View style={styles.searchTag}>
      <Text style={styles.searchTagText}>{label}</Text>
      <TouchableOpacity
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${label} from recent searches`}
      >
        <CloseIcon color={Colors.muted} size={14} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Stock Badge ──────────────────────────────────────────────────────────────

function StockBadge({ status }: { status: MedicationClinicResult["status"] }) {
  const config = {
    "in-stock": { bg: Colors.primaryLight, color: Colors.success, label: "In Stock" },
    "low-stock": { bg: Colors.yellowLight, color: Colors.warning, label: "Low Stock" },
    "out-of-stock": { bg: Colors.redLight, color: Colors.danger, label: "Out of Stock" },
  }[status];

  return (
    <View style={[styles.stockBadge, { backgroundColor: config.bg }]}>
      <Text style={[styles.stockBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

// ─── Clinic Med Result ────────────────────────────────────────────────────────

function ClinicMedResult({ item }: { item: MedicationClinicResult }) {
  const router = useRouter();
  const navigate = (href: string) => navigateWithBlur(router, href);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.resultCard}
      onPress={() => navigate(`/clinic/${item.clinicId}`)}
      accessibilityRole="button"
      accessibilityLabel={`${item.clinicName}, ${item.medName} ${item.status === "in-stock" ? "in stock" : item.status === "low-stock" ? "low stock" : "out of stock"}`}
    >
      <View style={styles.resultCardInner}>
        <Image
          source={{ uri: CLINIC_IMAGES[item.imageIndex] }}
          style={styles.resultImage}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <View style={styles.resultNameRow}>
            <Text style={styles.resultClinicName}>{item.clinicName}</Text>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceBadgeText}>{item.distance}</Text>
            </View>
          </View>
          <View style={styles.resultAreaRow}>
            <LocationIcon size={11} color={Colors.muted} />
            <Text style={styles.resultArea}>{item.area}</Text>
          </View>
          <View style={styles.resultMedRow}>
            <PillIcon size={14} color={Colors.muted} />
            <Text style={styles.resultMedName}>{item.medName}</Text>
            <View style={styles.formBadge}>
              <Text style={styles.formBadgeText}>{item.form}</Text>
            </View>
          </View>
          <View style={styles.resultStockRow}>
            <StockBadge status={item.status} />
            <Text style={styles.resultDetail}>{item.detail}</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center" }}>
          <ChevronRightIcon size={16} color={Colors.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function BackIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function MedicationsScreen() {
  const router = useRouter();
  const navigate = (href: string) => navigateWithBlur(router, href);
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortMode, setSortMode] = useState<"nearest" | "stock">("nearest");
  const [recentSearches, setRecentSearches] = useState([
    "Paracetamol",
    "Amoxicillin",
    "Insulin",
    "Salbutamol",
  ]);

  const removeSearch = (label: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== label));
  };
  const sortedResults = [...MEDICATION_NEARBY_RESULTS].sort((a, b) => {
    if (sortMode === "stock") {
      const rank = { "in-stock": 0, "low-stock": 1, "out-of-stock": 2 };
      return rank[a.status] - rank[b.status];
    }
    return Number.parseFloat(a.distance) - Number.parseFloat(b.distance);
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BackIcon />
          </TouchableOpacity>
          <ClinicQLogo size={26} />
        </View>
        <Text style={styles.headerTitle}>Medications</Text>
        <TouchableOpacity
          onPress={() => navigate("/notifications")}
          accessibilityRole="button"
          accessibilityLabel={
            unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
          }
        >
          <BellWithDot
            color={Colors.dark}
            size={22}
            dotColor={Colors.danger}
            hasDot={unreadCount > 0}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: getBottomPadding(24) }]}
      >
        <View style={styles.contentFrame}>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <SearchIcon size={18} color={Colors.muted} />
            <TextInput
              placeholder="Search medicine (e.g. Paracetamol)"
              placeholderTextColor={Colors.muted}
              style={styles.searchTextInput}
              accessibilityLabel="Search for a medication"
            />
          </View>
          <TouchableOpacity
            onPress={() => navigate("/medications/search")}
            style={styles.filterBtn}
            accessibilityRole="button"
            accessibilityLabel="Filter medications"
          >
            <FilterIcon size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.id}
              item={cat}
              active={activeCategory === cat.id}
              onPress={() => setActiveCategory(cat.id)}
            />
          ))}
        </ScrollView>

        {/* Recent Searches */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent searches</Text>
            <TouchableOpacity
              onPress={() => setRecentSearches([])}
              accessibilityRole="button"
              accessibilityLabel="Clear all recent searches"
            >
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsRow}>
            {recentSearches.map((s) => (
              <SearchTag key={s} label={s} onRemove={() => removeSearch(s)} />
            ))}
          </View>
        </View>

        {/* Nearby Results */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Nearby results</Text>
            <TouchableOpacity
              style={styles.sortBtn}
              onPress={() => setSortMode((mode) => (mode === "nearest" ? "stock" : "nearest"))}
              accessibilityRole="button"
              accessibilityLabel="Sort results"
            >
              <Text style={styles.sortText}>
                Sorted by: {sortMode === "nearest" ? "Nearest" : "Stock"}
              </Text>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6 9L12 15L18 9"
                  stroke={Colors.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {sortedResults.map((item, i) => (
            <ClinicMedResult key={i} item={item} />
          ))}
        </View>

        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertBannerIcon}>
            <BellWithDot color={Colors.white} size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertBannerTitle}>Can't find your medicine?</Text>
            <Text style={styles.alertBannerBody}>
              Enable alerts and we'll notify you when it's back in stock.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.alertBannerBtn}
            onPress={() =>
              Alert.alert(
                "Stock alerts enabled",
                "We'll notify you when matching medicines are available nearby."
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Enable stock alerts for this medication"
          >
            <Text style={styles.alertBannerBtnText}>Enable Alerts</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: Colors.dark },

  scrollContent: {},
  contentFrame: { width: "100%", maxWidth: 720, alignSelf: "center" },

  // Hero
  heroBanner: {
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  heroTitle: { fontSize: 18, fontWeight: "800", color: Colors.dark, lineHeight: 24 },
  heroBody: { fontSize: 13, color: Colors.muted, marginTop: 6, lineHeight: 18 },
  heroEmoji: { fontSize: 60 },

  // Search
  searchRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchTextInput: { flex: 1, fontSize: 14, color: Colors.dark, minWidth: 0 },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  // Categories
  categoriesRow: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
  categoryTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 42,
  },
  categoryTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryIcon: { display: "none" },
  categoryLabel: { fontSize: 13, fontWeight: "700", color: Colors.muted },
  categoryLabelActive: { color: Colors.white },
  categoryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white,
    marginTop: 3,
  },

  // Recent searches
  recentSection: { paddingHorizontal: 20, marginBottom: 18 },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recentTitle: { fontSize: 15, fontWeight: "800", color: Colors.dark },
  clearAllText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  searchTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchTagText: { fontSize: 13, color: Colors.dark },

  // Results
  resultsSection: { paddingHorizontal: 20 },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultsTitle: { fontSize: 15, fontWeight: "800", color: Colors.dark },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  sortText: { fontSize: 13, color: Colors.muted },

  // Result card
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultCardInner: { flexDirection: "row", padding: 12, gap: 10 },
  resultImage: { width: 68, height: 74, borderRadius: 12 },
  resultNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  resultClinicName: { fontSize: 14, fontWeight: "800", color: Colors.dark, flex: 1, lineHeight: 18 },
  distanceBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  distanceBadgeText: { fontSize: 11, fontWeight: "700", color: Colors.primary },
  resultAreaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  resultArea: { fontSize: 11, color: Colors.muted },
  resultMedRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  resultMedName: { fontSize: 12, color: Colors.dark, flexShrink: 1 },
  formBadge: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  formBadgeText: { fontSize: 10, color: Colors.muted },
  resultStockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  stockBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  stockBadgeText: { fontSize: 11, fontWeight: "700" },
  resultDetail: { fontSize: 11, color: Colors.muted },

  // Alert banner
  alertBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  alertBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBannerTitle: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  alertBannerBody: { fontSize: 12, color: Colors.muted },
  alertBannerBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
    alignItems: "center",
  },
  alertBannerBtnText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
});
