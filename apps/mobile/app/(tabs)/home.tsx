import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import {
  BellWithDot,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  FilterIcon,
  HeartIcon,
  LocationIcon,
  PeopleIcon,
  SearchIcon,
} from "../../components/ui/Icons";
import { useAppStore } from "../../stores/appStore";
import { CLINIC_IMAGES, CLINICS, type TrafficLevel } from "../../constants/clinics";
import { getBottomPadding, getGreeting, navigateWithBlur } from "../../utils/ui";

// ─── Language helpers ────────────────────────────────────────────────────────

const LANGUAGES = ["English", "isiZulu", "isiXhosa", "Afrikaans", "Sesotho", "Setswana"];

const LANG_CODES: Record<string, string> = {
  isiZulu: "ZU",
  isiXhosa: "XH",
  Afrikaans: "AF",
  Sesotho: "ST",
  Setswana: "TN",
  English: "EN",
};

// ─── Wait Badge ──────────────────────────────────────────────────────────────

const WAIT_BAR_WIDTHS: Record<TrafficLevel, number> = { busy: 85, moderate: 55, low: 25 };

function WaitBadge({ time, level }: { time: string; level: TrafficLevel }) {
  const barColor =
    level === "busy" ? Colors.danger : level === "moderate" ? Colors.warning : Colors.success;
  const barWidth = WAIT_BAR_WIDTHS[level];

  return (
    <View>
      <View style={styles.waitBadgeRow}>
        <ClockIcon color={Colors.primary} size={13} />
        <Text style={styles.waitBadgeLabel}>Est. wait time</Text>
      </View>
      <Text style={styles.waitBadgeTime}>{time}</Text>
      <View style={styles.waitBarTrack}>
        <View style={[styles.waitBarFill, { backgroundColor: barColor, width: `${barWidth}%` }]} />
      </View>
    </View>
  );
}

// ─── Traffic Badge ───────────────────────────────────────────────────────────

function TrafficBadge({ level, label }: { level: TrafficLevel; label: string }) {
  const color =
    level === "busy" ? Colors.busy : level === "moderate" ? Colors.moderate : Colors.low;
  const levelLabel =
    level === "busy" ? "Busy" : level === "moderate" ? "Moderate" : "Low";
  return (
    <View style={styles.trafficBadge}>
      <PeopleIcon color={color} size={15} />
      <View>
        <Text style={[styles.trafficLevel, { color }]}>{levelLabel}</Text>
        <Text style={styles.trafficLabel}>{label}</Text>
      </View>
    </View>
  );
}

// ─── Quick Action ────────────────────────────────────────────────────────────

function QuickAction({
  icon,
  label,
  bgColor,
  onPress,
  accessibilityLabel,
}: {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.quickActionWrapper}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: bgColor, shadowColor: bgColor }]}>
        {icon}
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Clinic Card ─────────────────────────────────────────────────────────────

function ClickableClinicCard({
  onPress,
  accessibilityLabel,
  children,
}: {
  onPress?: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
}) {
  if (Platform.OS === "web") {
    return (
      <View
        {...({
          onClick: onPress,
          onKeyDown: (event: any) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onPress?.();
            }
          },
        } as any)}
        style={styles.clinicCard}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.clinicCard}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </TouchableOpacity>
  );
}

function ClinicCard({
  name,
  area,
  distance,
  waitTime,
  trafficLevel,
  trafficLabel,
  imageIndex,
  onPress,
}: {
  name: string;
  area: string;
  distance: string;
  waitTime: string;
  trafficLevel: TrafficLevel;
  trafficLabel: string;
  imageIndex: number;
  onPress?: () => void;
}) {
  const [saved, setSaved] = React.useState(false);
  const accessibilityLabel = `${name}, ${area}, ${distance} away, estimated wait ${waitTime}`;

  return (
    <ClickableClinicCard
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.clinicCardInner}>
        <Image
          source={{ uri: CLINIC_IMAGES[imageIndex % CLINIC_IMAGES.length] }}
          style={styles.clinicImage}
          resizeMode="cover"
        />
        <View style={styles.clinicInfo}>
          <View style={styles.clinicNameRow}>
            <Text style={styles.clinicName}>{name}</Text>
            <TouchableOpacity
              style={styles.heartBtn}
              onPress={(event) => {
                event.stopPropagation();
                setSaved((v) => !v);
              }}
              accessibilityRole="button"
              accessibilityLabel={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
              accessibilityState={{ selected: saved }}
            >
              <HeartIcon color={saved ? Colors.danger : Colors.muted} size={18} filled={saved} />
            </TouchableOpacity>
          </View>
          <View style={styles.clinicAreaRow}>
            <LocationIcon color={Colors.muted} size={12} />
            <Text style={styles.clinicArea}>
              {area} • {distance}
            </Text>
          </View>
          <View style={styles.clinicBadgeRow}>
            <WaitBadge time={waitTime} level={trafficLevel} />
            <TrafficBadge level={trafficLevel} label={trafficLabel} />
          </View>
        </View>
        <View style={styles.clinicChevron}>
          <ChevronRightIcon color={Colors.muted} size={16} />
        </View>
      </View>
    </ClickableClinicCard>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const user = useAppStore((s) => s.user);
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const updateUser = useAppStore((s) => s.updateUser);
  const isTablet = width >= 768;

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user.name.split(" ")[0];
  const langCode = LANG_CODES[user.language] ?? "EN";

  const handleLanguageSelect = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        ...LANGUAGES.map((lang) => ({
          text: lang,
          onPress: () => updateUser({ language: lang }),
        })),
        { text: "Cancel", style: "cancel" as const, onPress: () => {} },
      ]
    );
  };

  const navigate = (href: string) => {
    navigateWithBlur(router, href);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
          { paddingBottom: getBottomPadding(20) },
        ]}
      >
        <View style={styles.contentFrame}>
        {/* ── Hero Header ── */}
        <View style={styles.heroCard}>
            {/* Top bar */}
            <View style={styles.topBar}>
              <ClinicQLogo size={30} />
              <View style={styles.topBarRight}>
                {/* Bell */}
                <TouchableOpacity
                  onPress={() => navigate("/notifications")}
                  accessibilityRole="button"
                  accessibilityLabel={
                    unreadCount > 0
                      ? `Notifications, ${unreadCount} unread`
                      : "Notifications"
                  }
                  style={styles.topBarBtn}
                >
                  <BellWithDot
                    color={Colors.dark}
                    size={20}
                    dotColor={Colors.danger}
                    hasDot={unreadCount > 0}
                  />
                </TouchableOpacity>
                {/* Language selector */}
                <TouchableOpacity
                  onPress={handleLanguageSelect}
                  accessibilityRole="button"
                  accessibilityLabel={`Language: ${user.language}. Tap to change.`}
                  style={styles.langBtn}
                >
                  <Text style={styles.langCode}>{langCode}</Text>
                  <ChevronDownIcon color={Colors.dark} size={12} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Greeting */}
            <View style={styles.greetingBlock}>
              <Text style={styles.greetingLine}>{greeting}</Text>
              <View style={styles.greetingNameRow}>
                <Text style={styles.greetingName}>{firstName}</Text>
                <Text style={styles.greetingWave}>👋</Text>
              </View>
              <Text style={styles.greetingTagline}>
                Shorter queues. Better care.{"\n"}Stronger communities.
              </Text>
            </View>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            onPress={() => navigate("/search")}
            style={styles.searchInput}
            accessibilityRole="search"
            accessibilityLabel="Search clinics and areas"
          >
            <SearchIcon color={Colors.muted} size={18} />
            <Text style={styles.searchPlaceholder}>Search clinics, areas...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("/search")}
            accessibilityRole="button"
            accessibilityLabel="Filter clinics"
            style={styles.filterBtn}
          >
            <FilterIcon color={Colors.white} size={20} />
          </TouchableOpacity>
        </View>

        {/* ── Quick Actions ── */}
        <View style={[styles.quickActionsCard, isTablet && styles.quickActionsCardTablet]}>
          <QuickAction
            bgColor={Colors.primary}
            label="Nearby Clinics"
            accessibilityLabel="Find nearby clinics"
            onPress={() => navigate("/nearby")}
            icon={
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                  fill="white"
                />
                <Circle cx={12} cy={9} r={2.5} fill={Colors.primary} />
              </Svg>
            }
          />
          <QuickAction
            bgColor={Colors.secondary}
            label="My Queue"
            accessibilityLabel="View my queue"
            onPress={() => navigate("/queue")}
            icon={
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Circle cx={9} cy={7} r={3} fill="white" />
                <Circle cx={17} cy={7} r={2.5} fill="white" />
                <Path
                  d="M3 20C3 17.2386 5.68629 15 9 15C12.3137 15 15 17.2386 15 20"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <Path
                  d="M19 20C19 18.3431 18.1046 17 17 17"
                  stroke="white"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </Svg>
            }
          />
          <QuickAction
            bgColor={Colors.teal}
            label="Medications"
            accessibilityLabel="Check medication availability"
            onPress={() => navigate("/medications")}
            icon={
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={8} width={18} height={13} rx={2} fill="white" />
                <Path d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8" stroke="white" strokeWidth={2} />
                <Path d="M12 12V17M9.5 14.5H14.5" stroke={Colors.teal} strokeWidth={2} strokeLinecap="round" />
              </Svg>
            }
          />
          <QuickAction
            bgColor={Colors.yellow}
            label="Reminders"
            accessibilityLabel="View medication reminders"
            onPress={() => navigate("/reminders")}
            icon={
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" fill="white" />
                <Path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18H20L18 16Z" fill="white" />
              </Svg>
            }
          />
        </View>

        {/* ── Nearby Clinics ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Clinics</Text>
            <TouchableOpacity
              onPress={() => navigate("/nearby")}
              style={styles.viewAllBtn}
              accessibilityRole="link"
              accessibilityLabel="View all nearby clinics"
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRightIcon color={Colors.primary} size={16} />
            </TouchableOpacity>
          </View>

          {CLINICS.slice(0, 3).map((clinic) => (
            <ClinicCard
              key={clinic.id}
              name={clinic.name}
              area={clinic.area}
              distance={clinic.distance}
              waitTime={clinic.waitTime}
              trafficLevel={clinic.trafficLevel}
              trafficLabel={clinic.trafficLabel}
              imageIndex={clinic.imageIndex}
              onPress={() => navigate(`/clinic/${clinic.id}`)}
            />
          ))}
        </View>

        {/* ── Community Banner ── */}
        <View style={styles.communityBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.communityTitle}>Healthcare is better together</Text>
            <Text style={styles.communityBody}>
              Join the queue remotely and save time. Help reduce overcrowding.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigate("/nearby")}
            style={styles.communityBtn}
            accessibilityRole="button"
            accessibilityLabel="See how to join a queue remotely"
          >
            <Text style={styles.communityBtnText}>See how</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { paddingTop: 0 },
  scrollContentTablet: { alignItems: "center" },
  contentFrame: { width: "100%", maxWidth: 720, alignSelf: "center" },

  // Hero
  heroCard: {
    backgroundColor: Colors.white,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 16,
  },
  topBarRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  topBarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.10)" as any,
    elevation: 2,
  },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.10)" as any,
    elevation: 2,
  },
  langCode: { fontSize: 13, fontWeight: "600", color: Colors.dark },

  // Greeting
  greetingBlock: { paddingHorizontal: 20 },
  greetingLine: { fontSize: 13, color: Colors.darkMid, fontWeight: "500" },
  greetingNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  greetingName: { fontSize: 24, fontWeight: "900", color: Colors.dark },
  greetingWave: { fontSize: 20 },
  greetingTagline: { fontSize: 13, color: Colors.muted, marginTop: 4, lineHeight: 18 },

  // Search
  searchRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)" as any,
    elevation: 2,
  },
  searchPlaceholder: { fontSize: 14, color: Colors.muted },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(27,107,58,0.30)" as any,
    elevation: 4,
  },

  // Quick actions
  quickActionsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)" as any,
    elevation: 2,
    marginBottom: 22,
    gap: 10,
  },
  quickActionsCardTablet: { flexWrap: "nowrap", padding: 18 },
  quickActionWrapper: {
    alignItems: "center",
    width: "47%",
    minHeight: 94,
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    boxShadow: "0 4px 8px rgba(0,0,0,0.18)" as any,
    elevation: 4,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.dark,
    textAlign: "center",
    lineHeight: 16,
  },

  // Section
  section: { paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: Colors.dark },
  viewAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  viewAllText: { fontSize: 14, fontWeight: "600", color: Colors.primary },

  // Clinic card
  clinicCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)" as any,
    elevation: 2,
  },
  clinicCardInner: { flexDirection: "row", padding: 12, gap: 10 },
  clinicImage: { width: 72, height: 76, borderRadius: 12 },
  clinicInfo: { flex: 1 },
  clinicNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clinicName: { fontSize: 14, fontWeight: "800", color: Colors.dark, flex: 1, lineHeight: 18 },
  heartBtn: { padding: 2 },
  clinicAreaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2, marginBottom: 8 },
  clinicArea: { fontSize: 12, color: Colors.muted },
  clinicBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 8,
  },
  clinicChevron: { justifyContent: "center" },

  // Wait badge
  waitBadgeRow: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  waitBadgeLabel: { fontSize: 10, color: Colors.muted },
  waitBadgeTime: { fontSize: 14, fontWeight: "800", color: Colors.primary, marginTop: 2 },
  waitBarTrack: {
    height: 3,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginTop: 4,
    width: 86,
  },
  waitBarFill: { height: 3, borderRadius: 2 },

  // Traffic badge
  trafficBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  trafficLevel: { fontSize: 12, fontWeight: "800" },
  trafficLabel: { fontSize: 11, color: Colors.muted },

  // Community banner
  communityBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  communityTitle: { fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 4 },
  communityBody: { fontSize: 13, color: Colors.muted, lineHeight: 18 },
  communityBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  communityBtnText: { color: Colors.white, fontWeight: "700", fontSize: 13 },
});
