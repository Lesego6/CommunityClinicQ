import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { Colors } from "../constants/colors";
import { useAuthStore } from "../stores/authStore";

type AdminSection = "staff" | "analytics" | "medications" | "scanner";

const navItems: Array<{ id: AdminSection; label: string; short: string }> = [
  { id: "staff", label: "Staff Management", short: "Staff" },
  { id: "analytics", label: "Queue Analytics", short: "Analytics" },
  { id: "medications", label: "Medication Stock", short: "Stock" },
  { id: "scanner", label: "Quick Scanner", short: "Scanner" },
];

const staff = [
  ["Thandi Mokoena", "Professional Nurse", "General Consultation", "On Duty"],
  ["Nomsa Dlamini", "Enrolled Nurse", "Chronic Care", "On Duty"],
  ["Lerato Jacobs", "Professional Nurse", "Immunization", "On Duty"],
  ["Sipho Khumalo", "Enrolled Nurse", "Minor Treatment", "Break"],
  ["Zanele Ngcobo", "Professional Nurse", "Maternal & Child Health", "On Duty"],
];

const stock = [
  ["Paracetamol 500mg", "1,250 tabs", "In Stock", "45 days"],
  ["Amoxicillin 250mg", "120 caps", "Low Stock", "3 days"],
  ["Salbutamol Inhaler", "0 inhalers", "Out of Stock", "0 days"],
  ["Metformin 500mg", "230 tabs", "Low Stock", "5 days"],
  ["Amlodipine 5mg", "560 tabs", "In Stock", "25 days"],
];

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellIcon() {
  return (
    <View>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M18 16V11C18 7.7 15.3 5 12 5S6 7.7 6 11V16L4 18H20L18 16Z" stroke={Colors.dark} strokeWidth={2} />
        <Path d="M10 21H14" stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" />
      </Svg>
      <View style={styles.notificationDot}>
        <Text style={styles.notificationText}>6</Text>
      </View>
    </View>
  );
}

function MenuIcon({ color = Colors.dark }: { color?: string }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7H20M4 12H20M4 17H20" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export default function ExpoAdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [active, setActive] = useState<AdminSection>("staff");
  const adminName = useAuthStore((s) => s.adminName);
  const logout = useAuthStore((s) => s.logout);

  const isDesktop = width >= 1024;
  const isTablet = width >= 700 && width < 1024;
  const isPhone = width < 700;
  const sidebarWidth = isDesktop ? 252 : 0;
  const contentWidth = Math.min(width - sidebarWidth - (isDesktop ? 56 : 24), 1180);

  const meta = useMemo(() => {
    if (active === "analytics") {
      return ["Queue Analytics", "Monitor and improve patient queue performance"];
    }
    if (active === "medications") {
      return ["Medication Stock Dashboard", "Monitor inventory, detect low stock and manage restocks"];
    }
    if (active === "scanner") {
      return ["Nurse Quick Scanner", "Scan patient QR code to check-in and view queue information instantly."];
    }
    return ["Staff Management", "Manage staff, assign queues and organize shifts"];
  }, [active]);

  const signOut = () => {
    logout();
    router.replace("/auth/phone");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.shell}>
        {isDesktop ? (
          <Sidebar active={active} setActive={setActive} signOut={signOut} adminName={adminName} />
        ) : null}

        <View style={styles.main}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/auth/phone")} style={styles.headerBtn}>
              {isDesktop ? <BackIcon /> : <MenuIcon />}
            </TouchableOpacity>
            {!isDesktop ? <ClinicQLogo size={31} /> : <Text style={styles.headerTitle}>ClinicQ Admin</Text>}
            <TouchableOpacity onPress={() => Alert.alert("Alerts", "6 admin alerts need review.")} style={styles.headerBtn}>
              <BellIcon />
            </TouchableOpacity>
          </View>

          {isTablet ? <TopTabs active={active} setActive={setActive} /> : null}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              {
                paddingBottom: isPhone ? insets.bottom + 96 : 34,
                maxWidth: contentWidth,
                alignSelf: "center",
                width: "100%",
              },
            ]}
          >
            <View style={[styles.pageHeader, !isPhone ? styles.pageHeaderWide : null]}>
              <View style={styles.pageTitleWrap}>
                <Text style={styles.eyebrow}>ClinicQ Admin{adminName ? ` · ${adminName}` : ""}</Text>
                <Text style={styles.title}>{meta[0]}</Text>
                <Text style={styles.subtitle}>{meta[1]}</Text>
              </View>
              {active === "staff" ? (
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>+ Add Staff</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {active === "staff" ? <StaffPanel width={contentWidth} /> : null}
            {active === "analytics" ? <AnalyticsPanel width={contentWidth} /> : null}
            {active === "medications" ? <MedicationPanel width={contentWidth} /> : null}
            {active === "scanner" ? <ScannerPanel width={contentWidth} /> : null}
          </ScrollView>

          {isPhone ? <BottomTabs active={active} setActive={setActive} signOut={signOut} /> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Sidebar({
  active,
  setActive,
  signOut,
  adminName,
}: {
  active: AdminSection;
  setActive: (section: AdminSection) => void;
  signOut: () => void;
  adminName: string | null;
}) {
  return (
    <View style={styles.sidebar}>
      <ClinicQLogo size={42} />
      <Text style={styles.sidebarLabel}>ADMIN PANEL</Text>
      <View style={styles.sidebarNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setActive(item.id)}
            style={[styles.sidebarItem, active === item.id ? styles.sidebarItemActive : null]}
          >
            <Text style={[styles.sidebarItemText, active === item.id ? styles.sidebarItemTextActive : null]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sidebarSupport}>
        <Text style={styles.supportTitle}>Signed in</Text>
        <Text style={styles.supportText}>{adminName || "Admin"} · Super Admin</Text>
        <TouchableOpacity onPress={signOut} style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TopTabs({ active, setActive }: { active: AdminSection; setActive: (section: AdminSection) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topTabs} contentContainerStyle={styles.topTabsContent}>
      {navItems.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => setActive(item.id)} style={[styles.tabChip, active === item.id ? styles.tabChipActive : null]}>
          <Text style={[styles.tabChipText, active === item.id ? styles.tabChipTextActive : null]}>{item.short}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function BottomTabs({
  active,
  setActive,
  signOut,
}: {
  active: AdminSection;
  setActive: (section: AdminSection) => void;
  signOut: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomTabs, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {navItems.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => setActive(item.id)} style={styles.bottomTabItem}>
          <Text style={[styles.bottomTabText, active === item.id ? styles.bottomTabTextActive : null]} numberOfLines={1}>
            {item.short}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={signOut} style={styles.bottomTabItem}>
        <Text style={styles.bottomTabText} numberOfLines={1}>Out</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatCard({ title, value, note, tone = Colors.primary, width }: { title: string; value: string; note: string; tone?: string; width: number }) {
  return (
    <View style={[styles.statCard, { width, borderColor: tone + "30", backgroundColor: tone + "08" }]}>
      <Text style={[styles.statTitle, { color: tone }]} numberOfLines={2}>{title}</Text>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statNote} numberOfLines={2}>{note}</Text>
    </View>
  );
}

function Pill({ label }: { label: string }) {
  const color = label.includes("Out") ? Colors.danger : label.includes("Low") || label === "Break" ? Colors.secondary : Colors.primary;
  return (
    <View style={[styles.pill, { backgroundColor: color + "16" }]}>
      <Text style={[styles.pillText, { color }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function responsiveWidths(containerWidth: number, columns: number, gap = 12) {
  const safeWidth = Math.max(containerWidth, 320);
  if (columns <= 1) return safeWidth;
  return Math.floor((safeWidth - gap * (columns - 1)) / columns);
}

function getColumns(width: number, desired: number) {
  if (width < 620) return 1;
  if (width < 920) return Math.min(2, desired);
  return desired;
}

function StaffPanel({ width }: { width: number }) {
  const statColumns = getColumns(width, 4);
  const statWidth = responsiveWidths(width, statColumns);
  const cardColumns = getColumns(width, 2);
  const cardWidth = responsiveWidths(width, cardColumns);

  return (
    <>
      <View style={styles.wrapGrid}>
        <StatCard width={statWidth} title="Active Staff" value="28" note="of 32 total staff" />
        <StatCard width={statWidth} title="On Duty Now" value="18" note="Across all queues" tone={Colors.blue} />
        <StatCard width={statWidth} title="Queues Covered" value="6" note="of 8 total queues" tone={Colors.secondary} />
        <StatCard width={statWidth} title="Upcoming Shifts" value="12" note="Next 24 hours" tone={Colors.purple} />
      </View>

      <View style={styles.wrapGrid}>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Active Nurses" action="View all" />
          {staff.map((item) => (
            <Row key={item[0]} left={item[0]} mid={`${item[1]} · ${item[2]}`} right={<Pill label={item[3]} />} />
          ))}
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Queue Assignment" action="View all" />
          {["General Consultation", "Chronic Care", "Immunization", "Maternal & Child Health", "Family Planning"].map((item, index) => (
            <Row key={item} left={item} mid={`${5 - Math.min(index, 3)} staff assigned`} right={<Text style={styles.chevron}>›</Text>} />
          ))}
        </View>
      </View>

      <View style={[styles.card, { width }]}>
        <SectionTitle title="Shift Management" action="Create Shift" />
        {staff.map((item, index) => (
          <Row
            key={`${item[0]}-shift`}
            left={item[0]}
            mid={index % 2 === 0 ? "07:00 - 15:00 Morning Shift" : "15:00 - 23:00 Afternoon Shift"}
            right={<Pill label={item[2]} />}
          />
        ))}
      </View>
    </>
  );
}

function AnalyticsPanel({ width }: { width: number }) {
  const statColumns = getColumns(width, 4);
  const statWidth = responsiveWidths(width, statColumns);
  const cardColumns = getColumns(width, 2);
  const cardWidth = responsiveWidths(width, cardColumns);

  return (
    <>
      <View style={styles.wrapGrid}>
        <StatCard width={statWidth} title="Average Wait Time" value="42 min" note="8 min faster than last week" />
        <StatCard width={statWidth} title="Patients Served" value="1,248" note="6.4% higher this week" tone={Colors.blue} />
        <StatCard width={statWidth} title="Peak Queue Today" value="87" note="At 10:00 AM" tone={Colors.purple} />
        <StatCard width={statWidth} title="Completion Rate" value="95%" note="3% higher this week" />
      </View>
      <View style={styles.wrapGrid}>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Average Wait Time Over Time" />
          <MiniLineChart />
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Queue Performance" />
          <Text style={styles.performanceScore}>82</Text>
          <Text style={styles.centerNote}>Good / 100</Text>
          {["Patients left without being seen 5%", "Average service time 12 min", "Patient satisfaction 4.6 / 5"].map((item) => (
            <Row key={item} left={item} mid="Improved" />
          ))}
        </View>
      </View>
    </>
  );
}

function MedicationPanel({ width }: { width: number }) {
  const statColumns = getColumns(width, 4);
  const statWidth = responsiveWidths(width, statColumns);
  const cardColumns = getColumns(width, 2);
  const cardWidth = responsiveWidths(width, cardColumns);

  return (
    <>
      <View style={styles.wrapGrid}>
        <StatCard width={statWidth} title="Low Stock Items" value="12" note="12% of total items" tone={Colors.danger} />
        <StatCard width={statWidth} title="Out of Stock Items" value="4" note="4% of total items" tone={Colors.secondary} />
        <StatCard width={statWidth} title="Total Items" value="125" note="Across all categories" />
        <StatCard width={statWidth} title="Inventory Value" value="R 285,430" note="Total current value" tone={Colors.blue} />
      </View>
      <View style={[styles.card, { width }]}>
        <SectionTitle title="Current Stock Overview" action="Filter" />
        {stock.map((item) => (
          <Row key={item[0]} left={item[0]} mid={`${item[1]} · ${item[3]} left`} right={<Pill label={item[2]} />} />
        ))}
      </View>
      <View style={styles.wrapGrid}>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Predicted Shortages" action="View all" />
          {stock.slice(1, 4).map((item) => (
            <Row key={`${item[0]}-shortage`} left={item[0]} mid="Likely to run out soon" right={<Pill label="Order Now" />} />
          ))}
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Recent Restock Alerts" action="View all" />
          {["Amoxicillin 250mg is low on stock", "Salbutamol Inhaler is out of stock", "Ciprofloxacin 500mg is out of stock"].map((item) => (
            <Row key={item} left={item} mid="Langa Community Clinic" right={<Pill label="Create Order" />} />
          ))}
        </View>
      </View>
    </>
  );
}

function ScannerPanel({ width }: { width: number }) {
  const cardColumns = getColumns(width, 2);
  const cardWidth = responsiveWidths(width, cardColumns);

  return (
    <>
      <View style={styles.wrapGrid}>
        <View style={[styles.scannerCard, { width: cardWidth }]}>
          <Text style={styles.scannerTitle}>Scan Patient QR Code</Text>
          <View style={styles.qrBox}>
            <Svg width={170} height={170} viewBox="0 0 170 170">
              <Rect width={170} height={170} rx={8} fill={Colors.white} />
              {Array.from({ length: 56 }).map((_, index) => (
                <Rect
                  key={index}
                  x={(index * 23) % 150 + 10}
                  y={(index * 37) % 150 + 10}
                  width={index % 3 === 0 ? 16 : 9}
                  height={index % 4 === 0 ? 16 : 9}
                  fill={Colors.dark}
                />
              ))}
            </Svg>
          </View>
          <View style={styles.scanLine} />
          <TouchableOpacity style={styles.flashButton}>
            <Text style={styles.flashButtonText}>Turn on Flash</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="How it works" />
          {["Ask the patient for their queue QR code", "Scan the QR code using the camera", "Review patient & queue info", "Tap Check-in to confirm instantly"].map((item, index) => (
            <Row key={item} left={`${index + 1}. ${item}`} mid="" />
          ))}
        </View>
      </View>
      <View style={[styles.card, { width }]}>
        <SectionTitle title="Last Scanned Patient" action="Checked in at 09:21 AM" />
        <Row left="Sipho Khumalo" mid="Queue A023 · 5th in queue · 35-45 min" right={<Pill label="Check-in Patient" />} />
      </View>
    </>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function Row({ left, mid, right }: { left: string; mid: string; right?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLeft} numberOfLines={2}>{left}</Text>
        {mid ? <Text style={styles.rowMid} numberOfLines={2}>{mid}</Text> : null}
      </View>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );
}

function MiniLineChart() {
  const points = "15,88 66,78 117,86 168,99 219,104 270,112 321,92";
  return (
    <Svg width="100%" height={170} viewBox="0 0 340 170">
      {[35, 70, 105, 140].map((y) => (
        <Path key={y} d={`M0 ${y}H340`} stroke={Colors.border} strokeWidth={1} />
      ))}
      <Path d={`M${points}`} fill="none" stroke={Colors.primary} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {points.split(" ").map((point) => {
        const [x, y] = point.split(",").map(Number);
        return <Circle key={point} cx={x} cy={y} r={5} fill={Colors.white} stroke={Colors.primary} strokeWidth={3} />;
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  shell: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.surface,
  },
  sidebar: {
    width: 252,
    flexShrink: 0,
    backgroundColor: "#052E2C",
    padding: 20,
    paddingTop: 26,
  },
  sidebarLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 36,
    marginBottom: 14,
  },
  sidebarNav: {
    gap: 8,
  },
  sidebarItem: {
    minHeight: 46,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  sidebarItemActive: {
    backgroundColor: Colors.primary,
  },
  sidebarItemText: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 14,
    fontWeight: "800",
  },
  sidebarItemTextActive: {
    color: Colors.white,
  },
  sidebarSupport: {
    marginTop: "auto",
    borderRadius: 14,
    backgroundColor: "rgba(22,163,74,0.16)",
    padding: 16,
  },
  supportTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "900",
  },
  supportText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 6,
    marginBottom: 14,
  },
  supportButton: {
    minHeight: 38,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  supportButtonText: {
    color: Colors.white,
    fontWeight: "900",
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  headerTitle: {
    color: Colors.dark,
    fontSize: 17,
    fontWeight: "900",
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  notificationDot: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "900",
  },
  topTabs: {
    flexGrow: 0,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabChip: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
  },
  tabChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabChipText: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: "900",
  },
  tabChipTextActive: {
    color: Colors.white,
  },
  bottomTabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 74,
    paddingTop: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    zIndex: 20,
  },
  bottomTabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },
  bottomTabText: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  bottomTabTextActive: {
    color: Colors.primary,
    fontWeight: "900",
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 18,
    gap: 14,
  },
  pageHeader: {
    gap: 14,
    marginBottom: 2,
  },
  pageHeaderWide: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  pageTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: Colors.dark,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  primaryButton: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: "900",
  },
  wrapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
    alignItems: "stretch",
  },
  statCard: {
    minHeight: 134,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  statTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  statValue: {
    color: Colors.dark,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 12,
  },
  statNote: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === "web" ? 0.04 : 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  sectionHeading: {
    flex: 1,
    color: Colors.dark,
    fontSize: 17,
    fontWeight: "900",
  },
  sectionAction: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  row: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 10,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowRight: {
    flexShrink: 0,
    maxWidth: "46%",
    alignItems: "flex-end",
  },
  rowLeft: {
    color: Colors.dark,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  rowMid: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  pill: {
    borderRadius: 8,
    minHeight: 28,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 150,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "900",
  },
  chevron: {
    color: Colors.muted,
    fontSize: 28,
  },
  performanceScore: {
    color: Colors.primary,
    fontSize: 56,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },
  centerNote: {
    color: Colors.muted,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "800",
  },
  scannerCard: {
    minHeight: 360,
    borderRadius: 16,
    backgroundColor: Colors.dark,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 20,
    marginTop: 12,
  },
  scannerTitle: {
    position: "absolute",
    top: 24,
    color: Colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  qrBox: {
    borderRadius: 12,
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    left: "18%",
    right: "18%",
    top: "50%",
    height: 3,
    backgroundColor: Colors.primaryMid,
  },
  flashButton: {
    position: "absolute",
    bottom: 22,
    minHeight: 40,
    borderRadius: 20,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  flashButtonText: {
    color: Colors.white,
    fontWeight: "900",
  },
});
