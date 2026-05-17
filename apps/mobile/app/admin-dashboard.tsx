import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { ClinicQLogo } from "../components/ui/ClinicQLogo";
import { Colors } from "../constants/colors";
import type { AdminQueuePatient } from "../stores/appStore";
import { useAppStore } from "../stores/appStore";
import { useAuthStore } from "../stores/authStore";

type AdminSection = "dashboard" | "queues" | "staff" | "analytics" | "medications" | "scanner";
type StockFilter = "All" | "Low Stock" | "Out of Stock";

const clinics = [
  { id: "langa-community", name: "Langa Community Clinic" },
  { id: "gugulethu", name: "Gugulethu Clinic" },
  { id: "nyanga-day", name: "Nyanga Day Clinic" },
];

const navItems: Array<{ id: AdminSection; label: string; short: string }> = [
  { id: "dashboard", label: "Dashboard", short: "Home" },
  { id: "queues", label: "Queue Management", short: "Queues" },
  { id: "staff", label: "Staff Management", short: "Staff" },
  { id: "analytics", label: "Queue Analytics", short: "Analytics" },
  { id: "medications", label: "Medication Stock", short: "Stock" },
  { id: "scanner", label: "Quick Scanner", short: "Scanner" },
];

const initialStaff = [
  ["Thandi Mokoena", "Professional Nurse", "General Consultation", "On Duty"],
  ["Nomsa Dlamini", "Enrolled Nurse", "Chronic Care", "On Duty"],
  ["Lerato Jacobs", "Professional Nurse", "Immunization", "On Duty"],
  ["Sipho Khumalo", "Enrolled Nurse", "Minor Treatment", "Break"],
  ["Zanele Ngcobo", "Professional Nurse", "Maternal & Child Health", "On Duty"],
];

const stockRows = [
  { name: "Paracetamol 500mg", stock: "1,250 tabs", status: "In Stock", days: "45 days", pct: 0.82 },
  { name: "Amoxicillin 250mg", stock: "120 caps", status: "Low Stock", days: "3 days", pct: 0.28 },
  { name: "Salbutamol Inhaler", stock: "0 inhalers", status: "Out of Stock", days: "0 days", pct: 0.02 },
  { name: "Metformin 500mg", stock: "230 tabs", status: "Low Stock", days: "5 days", pct: 0.36 },
  { name: "Amlodipine 5mg", stock: "560 tabs", status: "In Stock", days: "25 days", pct: 0.7 },
  { name: "Ibuprofen 400mg", stock: "80 tabs", status: "Low Stock", days: "2 days", pct: 0.2 },
];

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MenuIcon() {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7H20M4 12H20M4 17H20" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" />
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

export default function ExpoAdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [active, setActive] = useState<AdminSection>("dashboard");
  const [staff, setStaff] = useState(initialStaff);
  const adminName = useAuthStore((s) => s.adminName);
  const logout = useAuthStore((s) => s.logout);

  const isDesktop = width >= 980;
  const isTablet = width >= 700 && width < 980;
  const isPhone = width < 700;
  const sidebarWidth = isDesktop ? 252 : 0;
  const contentWidth = Math.max(320, Math.min(width - sidebarWidth - (isDesktop ? 56 : 24), 1180));

  const meta = useMemo(() => {
    const map: Record<AdminSection, [string, string]> = {
      dashboard: ["Dashboard", "Live clinic snapshot for today"],
      queues: ["Queue Management", "Call patients, watch queue flow and manage clinic load"],
      staff: ["Staff Management", "Manage staff, assign queues and organize shifts"],
      analytics: ["Queue Analytics", "Monitor and improve patient queue performance"],
      medications: ["Medication Stock Dashboard", "Monitor inventory, detect low stock and manage restocks"],
      scanner: ["Nurse Quick Scanner", "Scan patient QR code to check-in and view queue information instantly"],
    };
    return map[active];
  }, [active]);

  const signOut = () => {
    logout();
    router.replace("/auth/phone");
  };

  const addStaff = () => {
    const next = staff.length + 1;
    const nurse = [`New Nurse ${next}`, "Enrolled Nurse", "General Consultation", "On Duty"];
    setStaff((items) => [nurse, ...items]);
    Alert.alert("Staff added", `${nurse[0]} was added to today's roster.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.shell}>
        {isDesktop ? <Sidebar active={active} setActive={setActive} signOut={signOut} adminName={adminName} /> : null}

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
                paddingBottom: isPhone ? insets.bottom + 104 : 36,
                maxWidth: contentWidth,
                alignSelf: "center",
                width: "100%",
              },
            ]}
          >
            <View style={[styles.pageHeader, !isPhone ? styles.pageHeaderWide : null]}>
              <View style={styles.pageTitleWrap}>
                <Text style={styles.eyebrow}>ClinicQ Admin{adminName ? ` - ${adminName}` : ""}</Text>
                <Text style={styles.title}>{meta[0]}</Text>
                <Text style={styles.subtitle}>{meta[1]}</Text>
              </View>
              {active === "staff" ? (
                <TouchableOpacity onPress={addStaff} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>+ Add Staff</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {active === "dashboard" ? <DashboardPanel width={contentWidth} setActive={setActive} /> : null}
            {active === "queues" ? <QueuePanel width={contentWidth} /> : null}
            {active === "staff" ? <StaffPanel width={contentWidth} staff={staff} /> : null}
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
          <TouchableOpacity key={item.id} onPress={() => setActive(item.id)} style={[styles.sidebarItem, active === item.id ? styles.sidebarItemActive : null]}>
            <Text style={[styles.sidebarItemText, active === item.id ? styles.sidebarItemTextActive : null]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sidebarSupport}>
        <Text style={styles.supportTitle}>Signed in</Text>
        <Text style={styles.supportText}>{adminName || "Admin"} - Super Admin</Text>
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

function BottomTabs({ active, setActive, signOut }: { active: AdminSection; setActive: (section: AdminSection) => void; signOut: () => void }) {
  const insets = useSafeAreaInsets();
  const phoneItems = navItems.filter((item) => item.id !== "analytics");
  return (
    <View style={[styles.bottomTabs, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {phoneItems.map((item) => (
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

function DashboardPanel({ width, setActive }: { width: number; setActive: (section: AdminSection) => void }) {
  const columns = getColumns(width, 4);
  const statWidth = responsiveWidth(width, columns);
  const cardColumns = getColumns(width, 2);
  const cardWidth = responsiveWidth(width, cardColumns);
  const queue = useAppStore((s) => s.adminQueuePatients);
  const selectedClinicId = useAppStore((s) => s.selectedClinicId);
  const clinicName = clinics.find((clinic) => clinic.id === selectedClinicId)?.name || clinics[0].name;
  const called = queue.filter((p) => p.status === "called").length;

  return (
    <>
      <View style={styles.wrapGrid}>
        <StatCard width={statWidth} title="Patients Waiting" value={`${queue.filter((p) => p.status === "waiting").length}`} note={clinicName} />
        <StatCard width={statWidth} title="Called Today" value={`${called}`} note="Persists across admin tabs" tone={Colors.blue} />
        <StatCard width={statWidth} title="Avg Wait" value="42 min" note="8 min faster this week" tone={Colors.secondary} />
        <StatCard width={statWidth} title="Stock Alerts" value="16" note="Low and out of stock items" tone={Colors.danger} />
      </View>
      <View style={styles.wrapGrid}>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Live Queue" action="Open queues" onAction={() => setActive("queues")} />
          {queue.slice(0, 4).map((patient) => (
            <Row key={patient.id} left={`${patient.queueNumber} - ${patient.name}`} mid={`${patient.service} - ${patient.wait}`} right={<Pill label={patient.status === "called" ? "Called" : "Waiting"} />} />
          ))}
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Recent Activity" action="View all" />
          {["Nomsa joined Chronic Care", "A018 moved to room 2", "Amoxicillin marked low stock", "Morning shift fully covered"].map((item) => (
            <Row key={item} left={item} mid="Updated just now" />
          ))}
        </View>
      </View>
    </>
  );
}

function QueuePanel({ width }: { width: number }) {
  const selectedClinicId = useAppStore((s) => s.selectedClinicId);
  const setSelectedClinic = useAppStore((s) => s.setSelectedClinic);
  const patients = useAppStore((s) => s.adminQueuePatients);
  const callNext = useAppStore((s) => s.callNextAdminPatient);
  const resetQueue = useAppStore((s) => s.resetAdminQueue);
  const selectedClinic = clinics.find((clinic) => clinic.id === selectedClinicId) || clinics[0];
  const waiting = patients.filter((p) => p.status === "waiting");
  const called = patients.filter((p) => p.status === "called");
  const columns = getColumns(width, 4);
  const statWidth = responsiveWidth(width, columns);
  const nextPatient = waiting[0];

  return (
    <>
      <View style={styles.selectorRow}>
        {clinics.map((clinic) => (
          <TouchableOpacity key={clinic.id} onPress={() => setSelectedClinic(clinic.id)} style={[styles.selectChip, selectedClinic.id === clinic.id ? styles.selectChipActive : null]}>
            <Text style={[styles.selectChipText, selectedClinic.id === clinic.id ? styles.selectChipTextActive : null]}>{clinic.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.wrapGrid}>
        <StatCard width={statWidth} title="People Waiting" value={`${waiting.length}`} note={selectedClinic.name} />
        <StatCard width={statWidth} title="Now Serving" value={called[called.length - 1]?.queueNumber || "--"} note={called[called.length - 1]?.name || "No patient called yet"} tone={Colors.blue} />
        <StatCard width={statWidth} title="Next Patient" value={nextPatient?.queueNumber || "Done"} note={nextPatient?.name || "Queue is clear"} tone={Colors.secondary} />
        <StatCard width={statWidth} title="Avg Service" value="12 min" note="Live estimate" tone={Colors.purple} />
      </View>
      <View style={[styles.card, { width }]}>
        <View style={[styles.sectionTitle, styles.queueActions]}>
          <View style={styles.pageTitleWrap}>
            <Text style={styles.sectionHeading}>Live Queue</Text>
            <Text style={styles.rowMid}>This list persists when switching admin sections.</Text>
          </View>
          <TouchableOpacity onPress={callNext} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Call Next Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetQueue} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        {patients.map((patient) => (
          <Row
            key={patient.id}
            left={`${patient.queueNumber} - ${patient.name}`}
            mid={`${patient.service} - Est. wait ${patient.wait}`}
            right={<Pill label={patient.status === "called" ? "Called" : "Waiting"} />}
          />
        ))}
      </View>
    </>
  );
}

function StaffPanel({ width, staff }: { width: number; staff: string[][] }) {
  const statWidth = responsiveWidth(width, getColumns(width, 4));
  const cardWidth = responsiveWidth(width, getColumns(width, 2));
  return (
    <>
      <View style={styles.wrapGrid}>
        <StatCard width={statWidth} title="Active Staff" value={`${staff.length + 23}`} note="of 32 total staff" />
        <StatCard width={statWidth} title="On Duty Now" value="18" note="Across all queues" tone={Colors.blue} />
        <StatCard width={statWidth} title="Queues Covered" value="6" note="of 8 total queues" tone={Colors.secondary} />
        <StatCard width={statWidth} title="Upcoming Shifts" value="12" note="Next 24 hours" tone={Colors.purple} />
      </View>
      <View style={styles.wrapGrid}>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Active Nurses" action="View all" />
          {staff.map((item) => (
            <Row key={item[0]} left={item[0]} mid={`${item[1]} - ${item[2]}`} right={<Pill label={item[3]} />} />
          ))}
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Queue Assignment" action="Manage" />
          {["General Consultation", "Chronic Care", "Immunization", "Maternal & Child Health", "Family Planning"].map((item, index) => (
            <Row key={item} left={item} mid={`${5 - Math.min(index, 3)} staff assigned`} right={<Text style={styles.chevron}>{">"}</Text>} />
          ))}
        </View>
      </View>
      <View style={[styles.card, { width }]}>
        <SectionTitle title="Shift Management" action="Create Shift" />
        {staff.map((item, index) => (
          <Row key={`${item[0]}-shift`} left={item[0]} mid={index % 2 === 0 ? "07:00 - 15:00 Morning Shift" : "15:00 - 23:00 Afternoon Shift"} right={<Pill label={item[2]} />} />
        ))}
      </View>
    </>
  );
}

function AnalyticsPanel({ width }: { width: number }) {
  const statWidth = responsiveWidth(width, getColumns(width, 4));
  const cardWidth = responsiveWidth(width, getColumns(width, 2));
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
          <SectionTitle title="Average Wait Time" action="Minutes" />
          <MiniLineChart />
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Peak Hours" action="Queue size" />
          <MiniBarChart />
        </View>
      </View>
      <View style={[styles.card, { width }]}>
        <SectionTitle title="Queue Performance" />
        <Text style={styles.performanceScore}>82</Text>
        <Text style={styles.centerNote}>Good / 100</Text>
        {["Patients left without being seen: 5%", "Average service time: 12 min", "Patient satisfaction: 4.6 / 5"].map((item) => (
          <Row key={item} left={item} mid="Improved this week" />
        ))}
      </View>
    </>
  );
}

function MedicationPanel({ width }: { width: number }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StockFilter>("All");
  const statWidth = responsiveWidth(width, getColumns(width, 4));
  const cardWidth = responsiveWidth(width, getColumns(width, 2));
  const filteredRows = stockRows.filter((row) => {
    const matchesQuery = row.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === "All" || row.status === filter;
    return matchesQuery && matchesFilter;
  });

  const cycleFilter = () => {
    setFilter((current) => (current === "All" ? "Low Stock" : current === "Low Stock" ? "Out of Stock" : "All"));
  };

  return (
    <>
      <View style={styles.wrapGrid}>
        <StatCard width={statWidth} title="Low Stock Items" value="12" note="12% of total items" tone={Colors.danger} />
        <StatCard width={statWidth} title="Out of Stock Items" value="4" note="4% of total items" tone={Colors.secondary} />
        <StatCard width={statWidth} title="Total Items" value="125" note="Across all categories" />
        <StatCard width={statWidth} title="Inventory Value" value="R 285,430" note="Total current value" tone={Colors.blue} />
      </View>
      <View style={[styles.card, { width }]}>
        <SectionTitle title="Current Stock Overview" action={`Filter: ${filter}`} onAction={cycleFilter} />
        <View style={styles.searchBox}>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search medication..." placeholderTextColor={Colors.muted} style={styles.searchInput} />
        </View>
        {filteredRows.map((item) => (
          <StockRow key={item.name} item={item} />
        ))}
      </View>
      <View style={styles.wrapGrid}>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="Predicted Shortages" action="View all" />
          {stockRows.filter((item) => item.status !== "In Stock").slice(0, 4).map((item) => (
            <Row key={`${item.name}-shortage`} left={item.name} mid="Likely to run out soon" right={<Pill label="Order Now" />} />
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
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<"idle" | "scanning" | "scanned">("idle");
  const [scannedPatient, setScannedPatient] = useState<AdminQueuePatient | null>(null);
  const patients = useAppStore((s) => s.adminQueuePatients);
  const cardWidth = responsiveWidth(width, getColumns(width, 2));

  const showScanResult = (data: string) => {
    const normalized = data.trim().toUpperCase();
    const match = patients.find((patient) => {
      const queueNumber = patient.queueNumber.toUpperCase();
      const id = patient.id.toUpperCase();
      return normalized === queueNumber || normalized === id || normalized.includes(queueNumber);
    });

    setScannedPatient(
      match ?? {
        id: normalized || "unknown-ticket",
        name: "Unknown Patient",
        queueNumber: normalized || "Unknown QR",
        service: "General Consultation",
        wait: "Pending review",
        status: "checked-in",
      }
    );
    setScanState("scanned");
  };

  const simulateScan = () => {
    setScanState("scanning");
    setTimeout(() => showScanResult("A023"), 1000);
  };

  const resetScan = () => {
    setScanState("idle");
    setScannedPatient(null);
  };

  const scannerContent =
    Platform.OS === "web" ? (
      <>
        <Text style={styles.scannerTitle}>{scanState === "scanning" ? "Scanning..." : "Scan Patient QR Code"}</Text>
        <View style={styles.qrBox}>
          <Svg width={170} height={170} viewBox="0 0 170 170">
            <Rect width={170} height={170} rx={8} fill={Colors.white} />
            {Array.from({ length: 56 }).map((_, index) => (
              <Rect key={index} x={(index * 23) % 150 + 10} y={(index * 37) % 150 + 10} width={index % 3 === 0 ? 16 : 9} height={index % 4 === 0 ? 16 : 9} fill={Colors.dark} />
            ))}
          </Svg>
        </View>
        <View style={styles.scanLine} />
        <TouchableOpacity onPress={simulateScan} style={styles.flashButton}>
          <Text style={styles.flashButtonText}>{scanState === "scanning" ? "Reading QR..." : "Simulate Scan"}</Text>
        </TouchableOpacity>
      </>
    ) : !permission?.granted ? (
      <View style={styles.permissionBox}>
        <Text style={styles.scannerTitleStatic}>Camera permission required</Text>
        <Text style={styles.permissionText}>Allow camera access to scan patient queue QR codes.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.flashButtonStatic}>
          <Text style={styles.flashButtonText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    ) : scanState === "scanned" ? (
      <View style={styles.scanCompleteBox}>
        <Text style={styles.scanCompleteIcon}>✓</Text>
        <Text style={styles.scannerTitleStatic}>QR code scanned</Text>
        <TouchableOpacity onPress={resetScan} style={styles.flashButtonStatic}>
          <Text style={styles.flashButtonText}>Scan Another</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={({ data }) => showScanResult(data)}
        />
        <Text style={styles.scannerTitle}>Point camera at patient QR</Text>
        <View style={styles.cameraFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
        <View style={styles.scanLine} />
      </>
    );

  return (
    <>
      <View style={styles.wrapGrid}>
        <View style={[styles.scannerCard, { width: cardWidth }]}>
          {scannerContent}
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <SectionTitle title="How it works" />
          {["Ask for queue QR code", "Scan using the camera", "Review patient and queue info", "Tap check-in to confirm"].map((item, index) => (
            <Row key={item} left={`${index + 1}. ${item}`} mid="" />
          ))}
        </View>
      </View>
      {scanState === "scanned" ? (
        <View style={[styles.card, { width }]}>
          <SectionTitle title="Last Scanned Patient" action="Ready for check-in" />
          <Row
            left={scannedPatient?.name || "Unknown Patient"}
            mid={`Queue ${scannedPatient?.queueNumber || "--"} - ${scannedPatient?.service || "General Consultation"} - ${scannedPatient?.wait || "Pending review"}`}
            right={<Pill label="Check-in Patient" />}
          />
          {Platform.OS === "web" ? (
            <TouchableOpacity onPress={resetScan} style={[styles.secondaryButton, styles.scanAgainButton]}>
              <Text style={styles.secondaryButtonText}>Scan Another</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </>
  );
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {action ? (
        <TouchableOpacity disabled={!onAction} onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
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
      {right ? <View style={styles.rowRight}>{right}</View> : null}
    </View>
  );
}

function StockRow({ item }: { item: { name: string; stock: string; status: string; days: string; pct: number } }) {
  const color = statusColor(item.status);
  return (
    <View style={styles.stockRow}>
      <View style={styles.rowText}>
        <Text style={styles.rowLeft}>{item.name}</Text>
        <Text style={styles.rowMid}>{item.stock} - {item.days} left</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { flex: item.pct, backgroundColor: color }]} />
          <View style={{ flex: 1 - item.pct }} />
        </View>
      </View>
      <Pill label={item.status} />
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
  const color = statusColor(label);
  return (
    <View style={[styles.pill, { backgroundColor: color + "16" }]}>
      <Text style={[styles.pillText, { color }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function MiniLineChart() {
  const points = "15,88 66,78 117,86 168,99 219,104 270,112 321,92";
  return (
    <View>
      <Text style={styles.axisLabel}>Y-axis: minutes waited. X-axis: last 7 days.</Text>
      <Svg width="100%" height={180} viewBox="0 0 340 180">
        {[35, 70, 105, 140].map((y) => <Path key={y} d={`M0 ${y}H340`} stroke={Colors.border} strokeWidth={1} />)}
        <Path d={`M${points}`} fill="none" stroke={Colors.primary} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        {points.split(" ").map((point) => {
          const [x, y] = point.split(",").map(Number);
          return <Circle key={point} cx={x} cy={y} r={5} fill={Colors.white} stroke={Colors.primary} strokeWidth={3} />;
        })}
      </Svg>
    </View>
  );
}

function MiniBarChart() {
  const bars = [12, 28, 62, 87, 75, 60, 45, 30, 18];
  return (
    <View>
      <Text style={styles.axisLabel}>Y-axis: queue size. X-axis: clinic hour.</Text>
      <Svg width="100%" height={180} viewBox="0 0 340 180">
        {bars.map((value, index) => (
          <Rect key={index} x={12 + index * 36} y={158 - value * 1.45} width={18} height={value * 1.45} rx={6} fill={index === 3 ? Colors.secondary : Colors.primaryMid} />
        ))}
      </Svg>
    </View>
  );
}

function responsiveWidth(containerWidth: number, columns: number, gap = 12) {
  if (columns <= 1) return Math.max(290, containerWidth);
  return Math.floor((containerWidth - gap * (columns - 1)) / columns);
}

function getColumns(width: number, desired: number) {
  if (width < 620) return 1;
  if (width < 920) return Math.min(2, desired);
  return desired;
}

function statusColor(label: string) {
  if (label.includes("Out") || label === "Break") return Colors.danger;
  if (label.includes("Low") || label.includes("Order") || label.includes("Called")) return Colors.secondary;
  if (label.includes("Waiting")) return Colors.blue;
  return Colors.primary;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  shell: { flex: 1, flexDirection: "row", backgroundColor: Colors.surface },
  sidebar: {
    width: 252,
    flexShrink: 0,
    minHeight: "100%",
    backgroundColor: "#052E2C",
    padding: 20,
    paddingTop: 26,
    paddingBottom: 190,
  },
  sidebarLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 36,
    marginBottom: 14,
  },
  sidebarNav: { gap: 8 },
  sidebarItem: { minHeight: 46, borderRadius: 10, paddingHorizontal: 14, justifyContent: "center" },
  sidebarItemActive: { backgroundColor: Colors.primary },
  sidebarItemText: { color: "rgba(255,255,255,0.86)", fontSize: 14, fontWeight: "800" },
  sidebarItemTextActive: { color: Colors.white },
  sidebarSupport: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    borderRadius: 14,
    backgroundColor: "rgba(22,163,74,0.16)",
    padding: 16,
  },
  supportTitle: { color: Colors.white, fontSize: 14, fontWeight: "900" },
  supportText: { color: "rgba(255,255,255,0.72)", fontSize: 12, marginTop: 6, marginBottom: 14 },
  supportButton: { minHeight: 38, borderRadius: 9, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  supportButtonText: { color: Colors.white, fontWeight: "900" },
  main: { flex: 1, minWidth: 0 },
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
  headerTitle: { color: Colors.dark, fontSize: 17, fontWeight: "900" },
  headerBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: Colors.surface },
  notificationDot: { position: "absolute", top: -6, right: -8, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Colors.danger, alignItems: "center", justifyContent: "center" },
  notificationText: { color: Colors.white, fontSize: 10, fontWeight: "900" },
  topTabs: { flexGrow: 0, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  topTabsContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tabChip: { minHeight: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, justifyContent: "center" },
  tabChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabChipText: { color: Colors.muted, fontSize: 13, fontWeight: "900" },
  tabChipTextActive: { color: Colors.white },
  bottomTabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 76,
    paddingTop: 10,
    paddingHorizontal: 6,
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    zIndex: 20,
  },
  bottomTabItem: { flex: 1, alignItems: "center", justifyContent: "center", minWidth: 0 },
  bottomTabText: { color: Colors.muted, fontSize: 10, fontWeight: "800" },
  bottomTabTextActive: { color: Colors.primary, fontWeight: "900" },
  content: { paddingHorizontal: 14, paddingTop: 18, gap: 14 },
  pageHeader: { gap: 14, marginBottom: 2 },
  pageHeaderWide: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  pageTitleWrap: { flex: 1, minWidth: 0 },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  title: { color: Colors.dark, fontSize: 28, fontWeight: "900", marginTop: 4 },
  subtitle: { color: Colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  primaryButton: { minHeight: 44, borderRadius: 10, backgroundColor: Colors.primary, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { color: Colors.white, fontWeight: "900" },
  secondaryButton: { minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: Colors.primary, fontWeight: "900" },
  selectorRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  selectChip: { minHeight: 38, borderRadius: 19, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, justifyContent: "center", backgroundColor: Colors.white },
  selectChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  selectChipText: { color: Colors.muted, fontWeight: "800", fontSize: 12 },
  selectChipTextActive: { color: Colors.white },
  wrapGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12, alignItems: "stretch" },
  statCard: { minHeight: 134, borderRadius: 14, borderWidth: 1, padding: 16, backgroundColor: Colors.white },
  statTitle: { fontSize: 13, lineHeight: 17, fontWeight: "900" },
  statValue: { color: Colors.dark, fontSize: 30, fontWeight: "900", marginTop: 12 },
  statNote: { color: Colors.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
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
  sectionTitle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 10 },
  queueActions: { flexWrap: "wrap", alignItems: "flex-start" },
  sectionHeading: { flex: 1, color: Colors.dark, fontSize: 17, fontWeight: "900" },
  sectionAction: { color: Colors.primary, fontSize: 12, fontWeight: "900" },
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingVertical: 10 },
  stockRow: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingVertical: 10 },
  rowText: { flex: 1, minWidth: 0 },
  rowRight: { flexShrink: 0, maxWidth: "46%", alignItems: "flex-end" },
  rowLeft: { color: Colors.dark, fontSize: 14, lineHeight: 18, fontWeight: "800" },
  rowMid: { color: Colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  pill: { borderRadius: 8, minHeight: 28, paddingHorizontal: 10, alignItems: "center", justifyContent: "center", maxWidth: 160 },
  pillText: { fontSize: 12, fontWeight: "900" },
  chevron: { color: Colors.muted, fontSize: 22, fontWeight: "900" },
  searchBox: { minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, justifyContent: "center", paddingHorizontal: 12, marginBottom: 8 },
  searchInput: { color: Colors.dark, fontSize: 14 },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: Colors.border, flexDirection: "row", overflow: "hidden", marginTop: 9, maxWidth: 220 },
  progressFill: { borderRadius: 4 },
  performanceScore: { color: Colors.primary, fontSize: 56, fontWeight: "900", textAlign: "center", marginTop: 10 },
  centerNote: { color: Colors.muted, textAlign: "center", marginBottom: 12, fontWeight: "800" },
  axisLabel: { color: Colors.muted, fontSize: 12, marginBottom: 8 },
  scannerCard: { minHeight: 360, borderRadius: 16, backgroundColor: Colors.dark, alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 20, marginTop: 12 },
  scannerTitle: { position: "absolute", top: 24, color: Colors.white, fontSize: 16, fontWeight: "900" },
  scannerTitleStatic: { color: Colors.white, fontSize: 16, fontWeight: "900", textAlign: "center" },
  qrBox: { borderRadius: 12, overflow: "hidden" },
  scanLine: { position: "absolute", left: "18%", right: "18%", top: "50%", height: 3, backgroundColor: Colors.primaryMid },
  flashButton: { position: "absolute", bottom: 22, minHeight: 40, borderRadius: 20, paddingHorizontal: 18, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  flashButtonStatic: { minHeight: 40, borderRadius: 20, paddingHorizontal: 18, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  flashButtonText: { color: Colors.white, fontWeight: "900" },
  permissionBox: { alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 22 },
  permissionText: { color: "rgba(255,255,255,0.76)", fontSize: 13, lineHeight: 18, textAlign: "center" },
  cameraFrame: { width: 190, height: 190, borderRadius: 20 },
  corner: { position: "absolute", width: 42, height: 42, borderColor: Colors.white },
  cornerTopLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  cornerTopRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  cornerBottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  cornerBottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  scanCompleteBox: { alignItems: "center", justifyContent: "center", gap: 14 },
  scanCompleteIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, color: Colors.white, fontSize: 38, lineHeight: 64, fontWeight: "900", textAlign: "center" },
  scanAgainButton: { alignSelf: "flex-start", marginTop: 14 },
});
