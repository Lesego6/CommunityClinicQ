import React from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { CLINIC_IMAGES, CLINICS } from "../../constants/clinics";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { useAppStore } from "../../stores/appStore";
import { getBottomPadding } from "../../utils/ui";

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ size = 15, color = Colors.yellow }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
    </Svg>
  );
}

function HeartIcon({ filled = false, size = 16 }: { filled?: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? Colors.danger : "none"}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        stroke={filled ? Colors.danger : Colors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LocationIcon({ size = 15, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth={2} />
      <Circle cx={12} cy={9} r={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function PeopleIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={3} stroke={color} strokeWidth={2} />
      <Path d="M3 20C3 17.2386 5.68629 15 9 15C12.3137 15 15 17.2386 15 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={17} cy={7} r={2.5} stroke={color} strokeWidth={1.5} />
      <Path d="M21 20C21 18.3431 19.2091 17 17 17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function Pill({ label, tone = "green" }: { label: string; tone?: "green" | "orange" | "red" }) {
  const colors = {
    green: { bg: Colors.primaryLight, fg: Colors.primary },
    orange: { bg: Colors.secondaryLight, fg: Colors.warning },
    red: { bg: Colors.redLight, fg: Colors.danger },
  }[tone];

  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }]}>
      <Text style={[styles.pillText, { color: colors.fg }]}>{label}</Text>
    </View>
  );
}

export default function ClinicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const clinic = CLINICS.find((item) => item.id === id) ?? CLINICS[0];
  const activeTicket = useAppStore((s) => s.activeTicket);
  const leaveQueue = useAppStore((s) => s.leaveQueue);
  const favouriteClinicIds = useAppStore((s) => s.favouriteClinicIds);
  const toggleFavouriteClinic = useAppStore((s) => s.toggleFavouriteClinic);
  const heroImage = CLINIC_IMAGES[clinic.imageIndex % CLINIC_IMAGES.length];
  const isFavourite = favouriteClinicIds.includes(clinic.id);
  const stockHighlights = clinic.stockHighlights ?? clinic.services.map((service) => ({
    name: service,
    status: "in-stock" as const,
    detail: "Available",
  }));

  const trafficColor =
    clinic.trafficLevel === "busy"
      ? Colors.busy
      : clinic.trafficLevel === "moderate"
      ? Colors.moderate
      : Colors.low;

  const inThisQueue =
    activeTicket?.clinicId === clinic.id &&
    activeTicket.status !== "cancelled" &&
    activeTicket.status !== "done";

  const leaveCurrentQueue = () => {
    Alert.alert("Leave queue?", "You will lose your current position.", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: leaveQueue },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <BackIcon />
        </TouchableOpacity>
        <ClinicQLogo size={26} />
        <TouchableOpacity
          onPress={() => toggleFavouriteClinic(clinic.id)}
          style={[styles.headerAction, isFavourite && styles.headerActionSaved]}
          accessibilityRole="button"
          accessibilityLabel={isFavourite ? "Remove clinic from favourites" : "Save clinic to favourites"}
          accessibilityState={{ selected: isFavourite }}
        >
          <HeartIcon filled={isFavourite} />
          <Text style={[styles.headerActionText, isFavourite && styles.headerActionTextSaved]}>
            {isFavourite ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: getBottomPadding(24) }}>
        <Image source={{ uri: heroImage }} style={styles.heroImage} resizeMode="cover" />

        <View style={styles.summary}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{clinic.name}</Text>
              <View style={styles.metaRow}>
                <StarIcon />
                <Text style={styles.rating}>{clinic.rating}</Text>
                <Text style={styles.muted}>({clinic.reviews} reviews)</Text>
              </View>
              <View style={styles.metaRow}>
                <LocationIcon />
                <Text style={styles.muted}>{clinic.area} · {clinic.distance}</Text>
              </View>
            </View>
            <Pill label="Open" />
          </View>

          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Estimated wait</Text>
              <Text style={styles.statusValue}>{clinic.waitTime}</Text>
            </View>
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Traffic</Text>
              <View style={styles.statusInline}>
                <PeopleIcon color={trafficColor} />
                <Text style={[styles.statusValueSmall, { color: trafficColor }]}>{clinic.trafficLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() =>
                router.push({
                  pathname: inThisQueue ? "/queue/ticket" : "/queue/checkin",
                  params: { clinicId: clinic.id, clinicName: clinic.name },
                } as any)
              }
            >
              <Text style={styles.primaryBtnText}>{inThisQueue ? "View Queue" : "Join Queue"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() =>
                router.push({
                  pathname: "/clinic/directions",
                  params: { clinicId: clinic.id, clinicName: clinic.name },
                } as any)
              }
            >
              <Text style={styles.secondaryBtnText}>Directions</Text>
            </TouchableOpacity>
          </View>

          {inThisQueue && (
            <TouchableOpacity style={styles.leaveBtn} onPress={leaveCurrentQueue}>
              <Text style={styles.leaveBtnText}>Leave current queue</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.services}>
            {clinic.services.map((service) => (
              <Pill key={service} label={service} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinic information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hours</Text>
            <Text style={styles.infoValue}>Mon-Fri 08:00-16:00 · Sat 08:00-13:00</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${clinic.phone ?? "+27210000000"}`)}>
              <Text style={[styles.infoValue, styles.linkText]}>
                Call {clinic.phone ? clinic.phone.replace("+27", "0") : "clinic"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              router.push({
                pathname: "/clinic/reviews",
                params: { clinicId: clinic.id, clinicName: clinic.name },
              } as any)
            }
            accessibilityRole="button"
            accessibilityLabel={`View reviews for ${clinic.name}`}
          >
            <Text style={styles.infoLabel}>Reviews</Text>
            <Text style={[styles.infoValue, styles.linkText]}>
              {clinic.rating} rating from {clinic.reviews} reviews
            </Text>
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Medication stock</Text>
            <Text style={styles.infoValue}>Common chronic and pain relief medicines available</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current stock highlights</Text>
          {stockHighlights.map((item) => (
            <View key={item.name} style={styles.stockRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stockName}>{item.name}</Text>
                {item.detail && <Text style={styles.stockDetail}>{item.detail}</Text>}
              </View>
              <Pill
                label={
                  item.status === "in-stock"
                    ? "In Stock"
                    : item.status === "low-stock"
                    ? "Low Stock"
                    : "Out of Stock"
                }
                tone={
                  item.status === "in-stock"
                    ? "green"
                    : item.status === "low-stock"
                    ? "orange"
                    : "red"
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.primaryLight,
  },
  headerActionSaved: { backgroundColor: Colors.redLight },
  headerActionText: { color: Colors.primary, fontSize: 13, fontWeight: "800" },
  headerActionTextSaved: { color: Colors.danger },
  heroImage: { width: "100%", height: 178 },
  summary: {
    backgroundColor: Colors.white,
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  title: { fontSize: 22, fontWeight: "900", color: Colors.dark, lineHeight: 27 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  rating: { fontSize: 13, fontWeight: "800", color: Colors.dark },
  muted: { fontSize: 13, color: Colors.muted, flexShrink: 1 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, alignSelf: "flex-start" },
  pillText: { fontSize: 12, fontWeight: "800" },
  statusGrid: { flexDirection: "row", gap: 10, marginTop: 18 },
  statusCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 14, padding: 14 },
  statusLabel: { fontSize: 11, color: Colors.muted, marginBottom: 4 },
  statusValue: { fontSize: 18, color: Colors.primary, fontWeight: "900" },
  statusInline: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusValueSmall: { fontSize: 13, fontWeight: "800", flex: 1 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  primaryBtn: { flex: 1.2, backgroundColor: Colors.primary, borderRadius: 14, alignItems: "center", paddingVertical: 15 },
  primaryBtnText: { color: Colors.white, fontSize: 15, fontWeight: "900" },
  secondaryBtn: { flex: 1, backgroundColor: Colors.primaryLight, borderRadius: 14, alignItems: "center", paddingVertical: 15 },
  secondaryBtnText: { color: Colors.primary, fontSize: 15, fontWeight: "900" },
  leaveBtn: { marginTop: 10, borderRadius: 12, alignItems: "center", paddingVertical: 12, backgroundColor: Colors.redLight },
  leaveBtnText: { color: Colors.danger, fontSize: 14, fontWeight: "800" },
  section: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: Colors.dark, marginBottom: 12 },
  services: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  infoRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel: { color: Colors.muted, fontSize: 12, marginBottom: 3 },
  infoValue: { color: Colors.dark, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  linkText: { color: Colors.primary, fontWeight: "900" },
  stockRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, paddingVertical: 8 },
  stockName: { flex: 1, fontSize: 14, color: Colors.dark, fontWeight: "700" },
  stockDetail: { fontSize: 12, color: Colors.muted, marginTop: 2 },
});
