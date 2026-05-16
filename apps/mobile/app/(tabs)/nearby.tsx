import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLocation } from "../../hooks/useLocation";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import {
  BellWithDot,
  ChevronRightIcon,
  FilterIcon,
  LocationIcon,
  PeopleIcon,
  SearchIcon,
  StarIcon,
} from "../../components/ui/Icons";
import { useAppStore } from "../../stores/appStore";
import { CLINIC_IMAGES, CLINICS, type TrafficLevel } from "../../constants/clinics";
import { getBottomPadding } from "../../utils/ui";

// ─── Mock Map ────────────────────────────────────────────────────────────────

/**
 * A placeholder map using real pixel values derived from screen width.
 * Replace with react-native-maps when integrating a real map provider.
 * Marker wait times are derived from the first 4 entries in CLINICS.
 */
function MockMap() {
  const { width } = useWindowDimensions();
  const mapWidth = width - 40; // 20px padding each side
  const mapHeight = 180;

  // Use real wait-time labels from CLINICS (first 4 entries)
  const markerPositions = [
    { xFrac: 0.25, yFrac: 0.45 },
    { xFrac: 0.55, yFrac: 0.30 },
    { xFrac: 0.75, yFrac: 0.60 },
    { xFrac: 0.40, yFrac: 0.70 },
  ];

  // Extract a short numeric label from the waitTime string, e.g. "35–45 min" → "35"
  const markers = markerPositions.map((pos, i) => {
    const clinic = CLINICS[i];
    const shortWait = clinic
      ? clinic.waitTime.replace(/\s*min.*/, "").split("–")[0].trim()
      : "?";
    return { ...pos, label: shortWait };
  });

  const MARKER_SIZE = 32;
  const DOT_SIZE = 20;
  const PULSE_SIZE = 40;

  return (
    <View style={[styles.mapContainer, { width: mapWidth, height: mapHeight }]}>
      {/* Road grid */}
      <Svg
        width={mapWidth}
        height={mapHeight}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        style={StyleSheet.absoluteFill}
      >
        <Path d={`M0 ${mapHeight * 0.5} H${mapWidth}`} stroke="#C8D8C8" strokeWidth={8} />
        <Path d={`M0 ${mapHeight * 0.33} H${mapWidth}`} stroke="#C8D8C8" strokeWidth={4} />
        <Path d={`M0 ${mapHeight * 0.67} H${mapWidth}`} stroke="#C8D8C8" strokeWidth={4} />
        <Path d={`M${mapWidth * 0.33} 0 V${mapHeight}`} stroke="#C8D8C8" strokeWidth={8} />
        <Path d={`M${mapWidth * 0.67} 0 V${mapHeight}`} stroke="#C8D8C8" strokeWidth={4} />
        <Path d={`M${mapWidth * 0.17} 0 V${mapHeight}`} stroke="#C8D8C8" strokeWidth={4} />
        <Rect
          x={mapWidth * 0.36}
          y={mapHeight * 0.06}
          width={mapWidth * 0.28}
          height={mapHeight * 0.22}
          rx={4}
          fill="#B8D4B8"
          opacity={0.6}
        />
        <Rect
          x={mapWidth * 0.69}
          y={mapHeight * 0.56}
          width={mapWidth * 0.22}
          height={mapHeight * 0.28}
          rx={4}
          fill="#B8D4B8"
          opacity={0.6}
        />
      </Svg>

      {/* Clinic markers */}
      {markers.map((m, i) => {
        const left = m.xFrac * mapWidth - MARKER_SIZE / 2;
        const top = m.yFrac * mapHeight - MARKER_SIZE / 2;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.mapMarker, { left, top, width: MARKER_SIZE, height: MARKER_SIZE, borderRadius: MARKER_SIZE / 2 }]}
            accessibilityRole="button"
            accessibilityLabel={`Clinic marker showing ${m.label} minute wait`}
          >
            <Text style={styles.mapMarkerText}>{m.label}</Text>
          </TouchableOpacity>
        );
      })}

      {/* User location dot */}
      {(() => {
        const dotLeft = 0.48 * mapWidth - DOT_SIZE / 2;
        const dotTop = 0.48 * mapHeight - DOT_SIZE / 2;
        const pulseLeft = 0.48 * mapWidth - PULSE_SIZE / 2;
        const pulseTop = 0.48 * mapHeight - PULSE_SIZE / 2;
        return (
          <>
            <View
              style={[
                styles.mapPulse,
                { left: pulseLeft, top: pulseTop, width: PULSE_SIZE, height: PULSE_SIZE, borderRadius: PULSE_SIZE / 2 },
              ]}
            />
            <View
              style={[
                styles.mapUserDot,
                { left: dotLeft, top: dotTop, width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2 },
              ]}
            />
          </>
        );
      })()}
    </View>
  );
}

// ─── Map Legend ───────────────────────────────────────────────────────────────

function MapLegend() {
  return (
    <View style={styles.legend}>
      {(
        [
          { color: Colors.low, label: "Low wait time" },
          { color: Colors.moderate, label: "Moderate" },
          { color: Colors.busy, label: "Busy" },
        ] as { color: string; label: string }[]
      ).map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <PeopleIcon color={item.color} size={13} />
          <Text style={styles.legendLabel}>{item.label}</Text>
        </View>
      ))}
      <View style={{ flex: 1 }} />
      <Text style={styles.legendUpdated}>↻ Updated just now</Text>
    </View>
  );
}

// ─── Service Tag ─────────────────────────────────────────────────────────────

function ServiceTag({ label }: { label: string }) {
  return (
    <View style={styles.serviceTag}>
      <Text style={styles.serviceTagText}>{label}</Text>
    </View>
  );
}

// ─── Clinic List Item ─────────────────────────────────────────────────────────

function ClinicListItem({
  clinic,
  onPress,
}: {
  clinic: (typeof CLINICS)[0];
  onPress: () => void;
}) {
  const trafficColor =
    clinic.trafficLevel === "busy"
      ? Colors.busy
      : clinic.trafficLevel === "moderate"
      ? Colors.moderate
      : Colors.low;

  const waitBg =
    clinic.trafficLevel === "busy"
      ? "#FFF3E0"
      : clinic.trafficLevel === "moderate"
      ? "#FFFDE7"
      : Colors.primaryLight;

  const trafficLabel =
    clinic.trafficLevel === "busy"
      ? "Busy"
      : clinic.trafficLevel === "moderate"
      ? "Moderate"
      : "Low";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.clinicCard}
      accessibilityRole="button"
      accessibilityLabel={`${clinic.name}, ${clinic.area}, ${clinic.distance} away, estimated wait ${clinic.waitTime}`}
    >
      {/* Number badge */}
      <View style={styles.numBadge}>
        <Text style={styles.numBadgeText}>{clinic.num}</Text>
      </View>

      <View style={styles.clinicCardInner}>
        <Image
          source={{ uri: CLINIC_IMAGES[clinic.imageIndex] }}
          style={styles.clinicImage}
          resizeMode="cover"
        />
        <View style={styles.clinicInfo}>
          <View style={styles.clinicNameRow}>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>Open</Text>
            </View>
          </View>
          <View style={styles.clinicAreaRow}>
            <LocationIcon size={11} color={Colors.muted} />
            <Text style={styles.clinicArea}>
              {clinic.area} • {clinic.distance}
            </Text>
          </View>

          {/* Wait + traffic */}
          <View style={styles.waitRow}>
            <View style={[styles.waitBox, { backgroundColor: waitBg }]}>
              <Text style={styles.waitBoxLabel}>Est. wait time</Text>
              <Text style={styles.waitBoxTime}>{clinic.waitTime}</Text>
            </View>
            <View style={styles.trafficRow}>
              <PeopleIcon color={trafficColor} size={14} />
              <View>
                <Text style={[styles.trafficLevel, { color: trafficColor }]}>{trafficLabel}</Text>
                <Text style={styles.trafficLabel}>{clinic.trafficLabel}</Text>
              </View>
            </View>
          </View>

          {/* Services + rating */}
          <View style={styles.servicesRow}>
            <View style={styles.serviceTagsRow}>
              {clinic.services.slice(0, 2).map((s) => (
                <ServiceTag key={s} label={s} />
              ))}
            </View>
            <View style={styles.ratingRow}>
              <StarIcon size={12} />
              <Text style={styles.ratingText}>{clinic.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.clinicChevron}>
          <ChevronRightIcon size={16} color={Colors.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function NearbyScreen() {
  const router = useRouter();
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const [search, setSearch] = useState("");
  const { coords, status, refresh: refreshLocation } = useLocation();

  const filteredClinics = search.trim()
    ? CLINICS.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.area.toLowerCase().includes(search.toLowerCase())
      )
    : CLINICS;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <ClinicQLogo size={28} />
        <Text style={styles.headerTitle}>Nearby Clinics</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={styles.headerIconBtn}
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
            }
          >
            <BellWithDot
              color={Colors.dark}
              size={20}
              dotColor={Colors.danger}
              hasDot={unreadCount > 0}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/search")}
            style={styles.headerIconBtn}
            accessibilityRole="button"
            accessibilityLabel="Filter clinics"
          >
            <FilterIcon color={Colors.dark} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: getBottomPadding() }}
      >
        {/* Search + location row */}
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <SearchIcon size={16} color={Colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search clinics, areas..."
              placeholderTextColor={Colors.muted}
              style={styles.searchTextInput}
              accessibilityLabel="Search clinics and areas"
            />
          </View>
          <TouchableOpacity
            style={styles.locationBtn}
            accessibilityRole="button"
            accessibilityLabel="Use my current location"
            onPress={refreshLocation}
          >
            <LocationIcon size={14} color={Colors.primary} />
            <Text style={styles.locationBtnText}>
              {status === "requesting" ? "Locating…" : "Use my location"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location banner */}
        <View style={styles.locationBanner}>
          <View style={styles.locationBannerLeft}>
            <LocationIcon size={14} color={Colors.primary} />
            <View>
              <Text style={styles.locationBannerSub}>Showing clinics near</Text>
              <Text style={styles.locationBannerCity}>
                {coords
                  ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
                  : "Langa, Cape Town"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={refreshLocation}
            accessibilityRole="button"
            accessibilityLabel="Refresh location"
          >
            <Text style={styles.changeText}>{coords ? "Refresh" : "Change"}</Text>
          </TouchableOpacity>
        </View>

        {/* Location denied / error banner */}
        {(status === "denied" || status === "error") && (
          <View style={styles.locationErrorBanner}>
            <Text style={styles.locationErrorEmoji}>
              {status === "denied" ? "📍" : "⚠️"}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationErrorTitle}>
                {status === "denied" ? "Location access denied" : "Couldn't get your location"}
              </Text>
              <Text style={styles.locationErrorBody}>
                {status === "denied"
                  ? "Enable location in your device settings to see clinics near you."
                  : "Check your connection and try again."}
              </Text>
            </View>
            <TouchableOpacity
              onPress={refreshLocation}
              style={styles.locationErrorBtn}
              accessibilityRole="button"
              accessibilityLabel="Retry getting location"
            >
              <Text style={styles.locationErrorBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Map */}
        <View style={styles.mapWrapper}>
          <MockMap />
        </View>

        {/* Legend */}
        <MapLegend />

        {/* Clinic list */}
        <View style={styles.clinicList}>
          {filteredClinics.map((clinic) => (
            <ClinicListItem
              key={clinic.id}
              clinic={clinic}
              onPress={() => router.push(`/clinic/${clinic.id}` as any)}
            />
          ))}
          {filteredClinics.length === 0 && (
            <Text style={styles.noResults}>No clinics match your search.</Text>
          )}
        </View>

        {/* Suggest a clinic */}
        <View style={styles.suggestBanner}>
          <View style={styles.suggestIcon}>
            <LocationIcon size={20} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.suggestTitle}>Can't find a clinic?</Text>
            <Text style={styles.suggestBody}>
              Suggest a clinic in your area to help us improve.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.suggestBtn}
            accessibilityRole="button"
            accessibilityLabel="Suggest a clinic in your area"
          >
            <Text style={styles.suggestBtnText}>Suggest a Clinic</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: Colors.dark },
  headerRight: { flexDirection: "row", gap: 10 },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  // Search
  searchRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchTextInput: { flex: 1, fontSize: 14, color: Colors.dark },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  locationBtnText: { fontSize: 13, fontWeight: "600", color: Colors.primary },

  // Location banner
  locationBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationBannerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  locationBannerSub: { fontSize: 11, color: Colors.muted },
  locationBannerCity: { fontSize: 14, fontWeight: "700", color: Colors.dark },
  changeText: { fontSize: 13, fontWeight: "600", color: Colors.primary },

  // Map
  mapWrapper: { paddingHorizontal: 20, marginBottom: 16 },
  mapContainer: {
    backgroundColor: "#E8F0E8",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  mapMarker: {
    position: "absolute",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapMarkerText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  mapUserDot: {
    position: "absolute",
    backgroundColor: Colors.blue,
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  mapPulse: {
    position: "absolute",
    backgroundColor: Colors.blue,
    opacity: 0.15,
  },

  // Legend
  legend: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 16,
    alignItems: "center",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendLabel: { fontSize: 11, color: Colors.muted },
  legendUpdated: { fontSize: 11, color: Colors.muted },

  // Clinic list
  clinicList: { paddingHorizontal: 20 },
  noResults: { textAlign: "center", color: Colors.muted, marginTop: 24, fontSize: 14 },

  // Clinic card
  clinicCard: {
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
  clinicCardInner: { flexDirection: "row", padding: 12, gap: 12 },
  numBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  numBadgeText: { color: Colors.white, fontSize: 11, fontWeight: "700" },
  clinicImage: { width: 80, height: 80, borderRadius: 12 },
  clinicInfo: { flex: 1 },
  clinicNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clinicName: { fontSize: 14, fontWeight: "700", color: Colors.dark, flex: 1 },
  openBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  openBadgeText: { fontSize: 11, fontWeight: "600", color: Colors.primary },
  clinicAreaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  clinicArea: { fontSize: 11, color: Colors.muted },
  waitRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  waitBox: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  waitBoxLabel: { fontSize: 10, color: Colors.muted },
  waitBoxTime: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  trafficRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  trafficLevel: { fontSize: 12, fontWeight: "700" },
  trafficLabel: { fontSize: 10, color: Colors.muted },
  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  serviceTagsRow: { flexDirection: "row", gap: 4, flex: 1, flexWrap: "wrap" },
  serviceTag: {
    backgroundColor: Colors.surface,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceTagText: { fontSize: 10, color: Colors.muted },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontWeight: "600", color: Colors.dark },
  clinicChevron: { justifyContent: "center" },

  // Location error banner
  locationErrorBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FFCC80",
  },
  locationErrorEmoji: { fontSize: 20 },
  locationErrorTitle: { fontSize: 13, fontWeight: "700" as const, color: "#E65100" },
  locationErrorBody: { fontSize: 12, color: "#BF360C", marginTop: 2 },
  locationErrorBtn: {
    backgroundColor: "#E65100",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  locationErrorBtnText: { fontSize: 12, fontWeight: "700" as const, color: "#FFFFFF" },

  // Suggest banner
  suggestBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  suggestIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestTitle: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  suggestBody: { fontSize: 12, color: Colors.muted },
  suggestBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestBtnText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
});
