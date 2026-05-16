import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import {
  BellWithDot,
  CalendarIcon,
  ClockIcon,
  DocumentIcon,
  HourglassIcon,
  LocationIcon,
  PeopleIcon,
} from "../../components/ui/Icons";
import { useAppStore, type QueueTicket } from "../../stores/appStore";
import { navigateWithBlur } from "../../utils/ui";

// ─── Queue step mapping ───────────────────────────────────────────────────────

const STATUS_TO_STEP: Record<QueueTicket["status"], number> = {
  waiting: 1,
  almost: 2,
  serving: 3,
  done: 3,
  cancelled: 0,
};

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({ progress = 0.4, size = 100 }: { progress?: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={StyleSheet.absoluteFill}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.progressLabel}>Estimated</Text>
        <Text style={styles.progressLabel}>wait time</Text>
        <Text style={styles.progressTime}>35–45</Text>
        <Text style={styles.progressUnit}>min</Text>
      </View>
    </View>
  );
}

// ─── Queue Progress Steps ─────────────────────────────────────────────────────

// Defined outside the component so the array is not recreated on every render.
const QUEUE_STEPS = [
  { label: "Joined", sub: "08:32", icon: "📋" },
  { label: "In Queue", sub: "You're here", icon: "👥" },
  { label: "Almost Your Turn", sub: "~5 people left", icon: "👤" },
  { label: "Being Served", sub: "See a nurse", icon: "📋" },
];

function QueueProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <View style={styles.stepsWrapper}>
      <View style={styles.stepsRow}>
        {QUEUE_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: i <= currentStep ? Colors.primary : Colors.border,
                    borderWidth: i === currentStep ? 3 : 0,
                    borderColor: i === currentStep ? Colors.primaryLight : "transparent",
                  },
                ]}
                accessibilityRole="none"
              >
                {i <= currentStep ? (
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                ) : (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={8} r={3} stroke={Colors.muted} strokeWidth={2} />
                    <Path
                      d="M6 20C6 17.2386 8.68629 15 12 15C15.3137 15 18 17.2386 18 20"
                      stroke={Colors.muted}
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </Svg>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  { fontWeight: i <= currentStep ? "700" : "400", color: i <= currentStep ? Colors.primary : Colors.muted },
                ]}
              >
                {step.label}
              </Text>
              <Text style={styles.stepSub}>{step.sub}</Text>
            </View>
            {i < QUEUE_STEPS.length - 1 && (
              <View
                style={[
                  styles.stepConnector,
                  { backgroundColor: i < currentStep ? Colors.primary : Colors.border },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>{icon}</View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyQueueState() {
  const router = useRouter();
  const navigate = (href: string) => navigateWithBlur(router, href);
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🎫</Text>
      <Text style={styles.emptyTitle}>No active queue</Text>
      <Text style={styles.emptyBody}>
        You haven't joined any queue yet. Find a nearby clinic and join the queue to skip the wait.
      </Text>
      <TouchableOpacity
        onPress={() => navigate("/queue/checkin")}
        style={styles.emptyJoinBtn}
        accessibilityRole="button"
        accessibilityLabel="Join a queue"
      >
        <Text style={styles.emptyJoinBtnText}>Join a Queue</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigate("/(tabs)/nearby")}
        accessibilityRole="link"
        accessibilityLabel="Find nearby clinics"
      >
        <Text style={styles.emptyFindLink}>Find nearby clinics</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── History Item ─────────────────────────────────────────────────────────────

function HistoryItem({ ticket }: { ticket: QueueTicket }) {
  const statusColor =
    ticket.status === "done"
      ? Colors.success
      : ticket.status === "cancelled"
      ? Colors.danger
      : Colors.muted;
  const statusLabel =
    ticket.status === "done"
      ? "Completed"
      : ticket.status === "cancelled"
      ? "Cancelled"
      : "Expired";

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <Text style={styles.historyEmoji}>🏥</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.historyClinic}>{ticket.clinicName}</Text>
        <Text style={styles.historyService}>{ticket.serviceType}</Text>
        <Text style={styles.historyQueue}>Queue #{ticket.queueNumber}</Text>
      </View>
      <View style={[styles.historyBadge, { backgroundColor: statusColor + "20" }]}>
        <Text style={[styles.historyBadgeText, { color: statusColor }]}>{statusLabel}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function QueueScreen() {
  const router = useRouter();
  const navigate = (href: string) => navigateWithBlur(router, href);
  const activeTicket = useAppStore((s) => s.activeTicket);
  const queueHistory = useAppStore((s) => s.queueHistory);
  const leaveQueue = useAppStore((s) => s.leaveQueue);
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const [activeTab, setActiveTab] = useState<"ticket" | "history">("ticket");

  const hasActiveTicket =
    activeTicket &&
    activeTicket.status !== "cancelled" &&
    activeTicket.status !== "done";

  // Derive current step from ticket status — no more hardcoded 1
  const currentStep = useMemo(
    () => (activeTicket ? STATUS_TO_STEP[activeTicket.status] : 0),
    [activeTicket]
  );

  const handleLeaveQueue = () => {
    if (!hasActiveTicket) {
      Alert.alert("No active queue", "You are not currently waiting in a queue.");
      return;
    }
    const doLeaveQueue = () => {
      leaveQueue();
      if (Platform.OS !== "web") {
        Alert.alert("Queue left", "Your queue spot has been cancelled.");
      }
    };
    if (Platform.OS === "web") {
      if (globalThis.confirm("Leave queue? You will lose your spot.")) {
        doLeaveQueue();
      }
      return;
    }
    Alert.alert(
      "Leave Queue?",
      "Are you sure you want to leave the queue? You will lose your spot.",
      [
        { text: "Stay in queue", style: "cancel" },
        {
          text: "Leave queue",
          style: "destructive",
          onPress: doLeaveQueue,
        },
      ]
    );
  };

  const today = new Date().toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <ClinicQLogo size={28} />
        <Text style={styles.headerTitle}>My Queue</Text>
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

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["ticket", "history"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
            accessibilityLabel={tab === "ticket" ? "My Ticket tab" : "Queue History tab"}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "ticket" ? "My Ticket" : "Queue History"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "ticket" ? (
          hasActiveTicket ? (
            <>
              {/* Queue Ticket Card */}
              <View style={styles.card}>
                <View style={styles.ticketTop}>
                  <View>
                    <View style={styles.ticketNumberLabel}>
                      <PeopleIcon color={Colors.primary} size={16} />
                      <Text style={styles.ticketNumberSub}>Your current number</Text>
                    </View>
                    <Text style={styles.ticketNumber}>{activeTicket!.queueNumber}</Text>
                    <Text style={styles.ticketInQueue}>You are in the queue</Text>
                    <View style={styles.ticketJoinedRow}>
                      <ClockIcon color={Colors.muted} size={13} />
                      <Text style={styles.ticketJoined}>
                        Joined today at {activeTicket!.joinedAt}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.ticketClinicName}>{activeTicket!.clinicName}</Text>
                    <View style={styles.ticketClinicArea}>
                      <LocationIcon size={11} color={Colors.muted} />
                      <Text style={styles.ticketClinicAreaText}>
                        {activeTicket!.clinicAddress || "Cape Town"}
                      </Text>
                    </View>
                    <CircularProgress progress={0.45} size={110} />
                  </View>
                </View>
                <View style={styles.ticketStats}>
                  <View style={styles.ticketStatBox}>
                    <PeopleIcon color={Colors.primary} size={18} />
                    <View>
                      <Text style={styles.ticketStatLabel}>People ahead of you</Text>
                      <Text style={styles.ticketStatValue}>{activeTicket!.peopleAhead}</Text>
                    </View>
                  </View>
                  <View style={styles.ticketStatBox}>
                    <HourglassIcon color={Colors.primary} size={18} />
                    <View>
                      <Text style={styles.ticketStatLabel}>Estimated wait</Text>
                      <Text style={styles.ticketStatValue}>{activeTicket!.estimatedWait}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Notification Banner */}
              <View style={styles.notifBanner}>
                <View style={styles.notifBannerIcon}>
                  <BellWithDot color={Colors.dark} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifBannerTitle}>
                    We'll notify you when it's almost your turn!
                  </Text>
                  <Text style={styles.notifBannerBody}>
                    You'll receive a notification 5 people before your turn.
                  </Text>
                </View>
              </View>

              {/* Queue Progress */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Queue progress</Text>
                <QueueProgressSteps currentStep={currentStep} />
              </View>

              {/* Queue Details */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Queue details</Text>
                <DetailRow
                  icon={<LocationIcon size={16} color={Colors.primary} />}
                  label="Clinic"
                  value={activeTicket!.clinicName}
                />
                <DetailRow
                  icon={<CalendarIcon color={Colors.primary} size={16} />}
                  label="Date"
                  value={today}
                />
                <DetailRow
                  icon={<ClockIcon color={Colors.primary} size={16} />}
                  label="Time"
                  value={activeTicket!.joinedAt}
                />
                <DetailRow
                  icon={<DocumentIcon color={Colors.primary} size={16} />}
                  label="Queue Type"
                  value={activeTicket!.serviceType}
                />
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={() => navigate("/queue/ticket")}
                  style={styles.viewTicketBtn}
                  accessibilityRole="button"
                  accessibilityLabel="View ticket QR code"
                >
                  <CalendarIcon color={Colors.primary} size={20} />
                  <View>
                    <Text style={styles.viewTicketTitle}>View Ticket</Text>
                    <Text style={styles.viewTicketSub}>See QR code</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 18L15 12L9 6"
                      stroke={Colors.muted}
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLeaveQueue}
                  style={styles.leaveBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Leave queue and cancel your spot"
                >
                  <View style={styles.leaveBtnIcon}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="white"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                      />
                    </Svg>
                  </View>
                  <View>
                    <Text style={styles.leaveBtnTitle}>Leave Queue</Text>
                    <Text style={styles.leaveBtnSub}>Cancel your spot</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Tip */}
              <View style={styles.tipCard}>
                <View style={styles.tipIcon}>
                  <Text style={styles.tipEmoji}>💡</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tipTitle}>Tip</Text>
                  <Text style={styles.tipBody}>
                    Please arrive at the clinic at least 15 minutes before your estimated time.
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <EmptyQueueState />
              <TouchableOpacity
                onPress={() => navigate("/queue/checkin")}
                style={styles.joinNowBtn}
                accessibilityRole="button"
                accessibilityLabel="Join a queue now"
              >
                <Text style={styles.joinNowBtnText}>Join a Queue Now</Text>
              </TouchableOpacity>
            </>
          )
        ) : queueHistory.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyHistoryEmoji}>📋</Text>
            <Text style={styles.emptyHistoryTitle}>No queue history yet</Text>
            <Text style={styles.emptyHistoryBody}>
              Your past queue visits will appear here.
            </Text>
          </View>
        ) : (
          // FlatList-style rendering for history (avoids nested VirtualizedList warning)
          queueHistory.map((ticket) => (
            <HistoryItem key={ticket.id} ticket={ticket} />
          ))
        )}
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

  // Tabs
  tabs: { flexDirection: "row", backgroundColor: Colors.white, paddingHorizontal: 20 },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: "600", color: Colors.muted },
  tabTextActive: { color: Colors.primary },

  scrollContent: { padding: 20, gap: 16 },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 16 },

  // Ticket
  ticketTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  ticketNumberLabel: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  ticketNumberSub: { fontSize: 12, color: Colors.muted },
  ticketNumber: { fontSize: 64, fontWeight: "900", color: Colors.primary, lineHeight: 68 },
  ticketInQueue: { fontSize: 13, color: Colors.muted, marginTop: 2 },
  ticketJoinedRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  ticketJoined: { fontSize: 12, color: Colors.muted },
  ticketClinicName: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  ticketClinicArea: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  ticketClinicAreaText: { fontSize: 11, color: Colors.muted },
  ticketStats: { flexDirection: "row", marginTop: 16, gap: 12 },
  ticketStatBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketStatLabel: { fontSize: 11, color: Colors.muted },
  ticketStatValue: { fontSize: 22, fontWeight: "800", color: Colors.dark },

  // Circular progress labels
  progressLabel: { fontSize: 11, color: Colors.muted },
  progressTime: { fontSize: 18, fontWeight: "800", color: Colors.primary, lineHeight: 22 },
  progressUnit: { fontSize: 12, color: Colors.primary, fontWeight: "600" },

  // Notification banner
  notifBanner: {
    backgroundColor: Colors.yellowLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notifBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBannerTitle: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  notifBannerBody: { fontSize: 12, color: Colors.muted, marginTop: 2 },

  // Steps
  stepsWrapper: { paddingHorizontal: 4 },
  stepsRow: { flexDirection: "row", alignItems: "center" },
  stepItem: { alignItems: "center", flex: 1 },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIcon: { fontSize: 16 },
  stepLabel: { fontSize: 10, marginTop: 4, textAlign: "center" },
  stepSub: { fontSize: 9, color: Colors.muted, textAlign: "center" },
  stepConnector: { height: 2, flex: 0.5, marginBottom: 28 },

  // Detail row
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailIcon: { width: 28 },
  detailLabel: { flex: 1, fontSize: 13, color: Colors.muted },
  detailValue: { fontSize: 13, fontWeight: "600", color: Colors.dark },

  // Actions
  actionsRow: { flexDirection: "row", gap: 12 },
  viewTicketBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewTicketTitle: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  viewTicketSub: { fontSize: 11, color: Colors.muted },
  leaveBtn: {
    flex: 1,
    backgroundColor: Colors.redLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leaveBtnIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveBtnTitle: { fontSize: 13, fontWeight: "700", color: Colors.danger },
  leaveBtnSub: { fontSize: 11, color: Colors.muted },

  // Tip
  tipCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  tipEmoji: { fontSize: 18 },
  tipTitle: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  tipBody: { fontSize: 12, color: Colors.muted },

  // Empty state
  emptyState: { alignItems: "center", padding: 32, gap: 16 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.dark, textAlign: "center" },
  emptyBody: { fontSize: 14, color: Colors.muted, textAlign: "center", lineHeight: 20 },
  emptyJoinBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  emptyJoinBtnText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
  emptyFindLink: { fontSize: 14, color: Colors.primary, fontWeight: "600" },

  // Join now
  joinNowBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinNowBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },

  // History
  historyItem: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  historyEmoji: { fontSize: 22 },
  historyClinic: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  historyService: { fontSize: 12, color: Colors.muted },
  historyQueue: { fontSize: 11, color: Colors.muted },
  historyBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  historyBadgeText: { fontSize: 12, fontWeight: "700" },

  // Empty history
  emptyHistory: { alignItems: "center", padding: 32, gap: 12 },
  emptyHistoryEmoji: { fontSize: 48 },
  emptyHistoryTitle: { fontSize: 16, fontWeight: "700", color: Colors.dark },
  emptyHistoryBody: { fontSize: 13, color: Colors.muted, textAlign: "center" },
});
