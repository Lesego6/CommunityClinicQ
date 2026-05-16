import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path, Circle } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import {
  BellWithDot,
  CalendarIcon,
  CameraIcon,
  ChevronRightIcon,
  GlobeIcon,
  HelpIcon,
  LocationIcon,
  LogoutIcon,
  MailIcon,
  PersonIcon,
  PhoneIcon,
  PillIcon,
  SettingsIcon,
  ShieldIcon,
  StarIcon,
} from "../../components/ui/Icons";
import { useAppStore } from "../../stores/appStore";
import { useAuthStore } from "../../stores/authStore";
import { getGreeting, navigateWithBlur } from "../../utils/ui";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  hasChevron = false,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hasChevron?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      disabled={!onPress && !hasChevron}
      accessibilityRole={hasChevron ? "button" : "none"}
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={styles.infoRowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
      {hasChevron && <ChevronRightIcon size={16} color={Colors.muted} />}
    </TouchableOpacity>
  );
}

// ─── Reminder Row ─────────────────────────────────────────────────────────────

function ReminderRow({
  icon,
  iconBg,
  title,
  subtitle,
  badge,
  badgeColor,
  onPress,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.reminderRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${subtitle}, status: ${badge}`}
    >
      <View style={[styles.reminderIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.reminderBadge, { backgroundColor: badgeColor + "20" }]}>
        <Text style={[styles.reminderBadgeText, { color: badgeColor }]}>{badge}</Text>
      </View>
      <ChevronRightIcon size={16} color={Colors.muted} />
    </TouchableOpacity>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────

function QuickActionBtn({
  icon,
  label,
  bg,
  color,
  onPress,
  accessibilityLabel,
}: {
  icon: React.ReactNode;
  label: string;
  bg: string;
  color: string;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.quickActionBtn, { backgroundColor: bg }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
      <Text style={[styles.quickActionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;
  const navigate = (href: string) => navigateWithBlur(router, href);
  const user = useAppStore((s) => s.user);
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const appointments = useAppStore((s) => s.appointments);
  const medicationReminders = useAppStore((s) => s.medicationReminders);
  const updateUser = useAppStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [draftUser, setDraftUser] = React.useState({
    name: user.name,
    phone: user.phone,
    email: user.email ?? "",
    location: user.location,
    language: user.language,
  });

  const firstName = user.name.split(" ")[0];
  const greeting = getGreeting();
  const upcomingAppt = appointments.find((a) => a.status === "upcoming");
  const activeReminders = medicationReminders.filter((r) => r.enabled);

  const handleLogout = () => {
    const doLogout = () => {
      logout();
      router.replace("/auth/phone");
    };
    if (Platform.OS === "web") {
      if (globalThis.confirm("Are you sure you want to log out?")) {
        doLogout();
      }
      return;
    }
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: doLogout,
        },
      ]
    );
  };

  const iconBox = (bg: string, icon: React.ReactNode) => (
    <View style={[styles.quickActionIconBox, { backgroundColor: bg }]}>{icon}</View>
  );
  const openEditProfile = () => {
    setDraftUser({
      name: user.name,
      phone: user.phone,
      email: user.email ?? "",
      location: user.location,
      language: user.language,
    });
    setShowEditProfile(true);
  };
  const saveProfile = () => {
    updateUser({
      name: draftUser.name.trim() || user.name,
      phone: draftUser.phone.trim() || user.phone,
      email: draftUser.email.trim(),
      location: draftUser.location.trim() || user.location,
      language: draftUser.language.trim() || user.language,
    });
    setShowEditProfile(false);
  };
  const changeProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      updateUser({ avatar: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <ClinicQLogo size={28} />
        <View style={styles.headerRight}>
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
          <TouchableOpacity
            onPress={() => navigate("/notifications")}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <SettingsIcon color={Colors.dark} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Profile Hero ── */}
        <View style={styles.profileHero}>
          <View style={styles.profileHeroRow}>
            {/* Avatar */}
            <View style={{ position: "relative" }}>
              <Image
                source={{
                  uri:
                    user.avatar ??
                    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.avatarEditBtn}
                onPress={changeProfilePhoto}
                accessibilityRole="button"
                accessibilityLabel="Change profile photo"
              >
                <CameraIcon color={Colors.white} size={12} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetingLine}>{greeting}</Text>
              <View style={styles.greetingNameRow}>
                <Text style={styles.greetingName}>{firstName}</Text>
                <Text style={styles.greetingWave}>👋</Text>
              </View>
              <Text style={styles.greetingTagline}>
                Together, we build healthier communities.
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, isNarrow && styles.statsRowNarrow]}>
            <StatCard
              icon={<PersonIcon size={20} color={Colors.primary} />}
              value={user.memberSince}
              label="Member since"
              color={Colors.primary}
            />
            <View style={styles.statDivider} />
            <StatCard
              icon={<StarIcon size={20} color={Colors.yellow} />}
              value="8"
              label="Total visits"
              color={Colors.yellow}
            />
            <View style={styles.statDivider} />
            <StatCard
              icon={<CalendarIcon size={20} color={Colors.teal} />}
              value="6"
              label="Queues joined"
              color={Colors.teal}
            />
            <View style={styles.statDivider} />
            <StatCard
              icon={
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    fill={Colors.secondary}
                  />
                </Svg>
              }
              value={String(activeReminders.length)}
              label="Reminders set"
              color={Colors.secondary}
            />
          </View>
        </View>

        {/* ── My Information ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Information</Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={openEditProfile}
              accessibilityRole="button"
              accessibilityLabel="Edit personal information"
            >
              <Text style={styles.editBtnText}>Edit</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <InfoRow
            icon={<PersonIcon size={16} color={Colors.primary} />}
            label="Full name"
            value={user.name}
          />
          <InfoRow
            icon={<PhoneIcon size={16} color={Colors.primary} />}
            label="Phone number"
            value={user.phone}
          />
          <InfoRow
            icon={<MailIcon size={16} color={Colors.primary} />}
            label="Email address"
            value={user.email}
          />
          <InfoRow
            icon={<GlobeIcon size={16} color={Colors.primary} />}
            label="Language"
            value={user.language}
            hasChevron
          />
          <InfoRow
            icon={<LocationIcon size={16} color={Colors.primary} />}
            label="Location"
            value={user.location}
            hasChevron
          />
        </View>

        {/* ── My Reminders ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Reminders</Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigate("/reminders")}
              accessibilityRole="link"
              accessibilityLabel="View all reminders"
            >
              <Text style={styles.editBtnText}>View all</Text>
              <ChevronRightIcon size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {upcomingAppt && (
            <ReminderRow
              icon={<CalendarIcon size={20} color={Colors.primary} />}
              iconBg={Colors.primaryLight}
              title="Next appointment"
              subtitle={upcomingAppt.clinicName}
              badge="Upcoming"
              badgeColor={Colors.primary}
              onPress={() => navigate("/appointment-booking")}
            />
          )}
          {activeReminders.slice(0, 1).map((r) => (
            <View key={r.id} style={{ paddingTop: 4 }}>
              <ReminderRow
                icon={<PillIcon size={20} color={Colors.secondary} />}
                iconBg={Colors.secondaryLight}
                title="Medication reminder"
                subtitle={r.name}
                badge="Active"
                badgeColor={Colors.secondary}
                onPress={() => navigate("/reminders")}
              />
            </View>
          ))}
          {upcomingAppt && (
            <Text style={styles.reminderDate}>
              📅 {upcomingAppt.date} • {upcomingAppt.time}
            </Text>
          )}
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={[styles.quickActionsRow, isNarrow && styles.quickActionsRowNarrow]}>
            <QuickActionBtn
              bg={Colors.primaryLight}
              color={Colors.primary}
              label={"Notification\nSettings"}
              accessibilityLabel="Notification settings"
              onPress={() => navigate("/notifications")}
              icon={iconBox(
                Colors.primary,
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" fill="white" />
                  <Path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18H20L18 16Z" fill="white" />
                </Svg>
              )}
            />
            <QuickActionBtn
              bg={Colors.yellowLight}
              color={Colors.warning}
              label={"Privacy &\nSecurity"}
              accessibilityLabel="Privacy and security settings"
              onPress={() => navigate("/health-records")}
              icon={iconBox(Colors.yellow, <ShieldIcon color={Colors.white} size={18} />)}
            />
            <QuickActionBtn
              bg={Colors.blueLight}
              color={Colors.blue}
              label={"Help &\nSupport"}
              accessibilityLabel="Help and support"
              onPress={() => navigate("/emergency")}
              icon={iconBox(Colors.blue, <HelpIcon color={Colors.white} size={18} />)}
            />
            <QuickActionBtn
              bg={Colors.redLight}
              color={Colors.danger}
              label={"Log Out"}
              accessibilityLabel="Log out of the app"
              onPress={handleLogout}
              icon={iconBox(Colors.danger, <LogoutIcon color={Colors.white} size={18} />)}
            />
          </View>
        </View>
      </ScrollView>
      <Modal visible={showEditProfile} transparent animationType="fade" onRequestClose={() => setShowEditProfile(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <Text style={styles.editModalTitle}>Edit information</Text>
            {[
              ["Full name", "name"],
              ["Phone number", "phone"],
              ["Email", "email"],
              ["Location", "location"],
              ["Language", "language"],
            ].map(([label, key]) => (
              <View key={key} style={styles.editField}>
                <Text style={styles.editFieldLabel}>{label}</Text>
                <TextInput
                  value={draftUser[key as keyof typeof draftUser]}
                  onChangeText={(value) => setDraftUser((current) => ({ ...current, [key]: value }))}
                  style={styles.editInput}
                  placeholder={label}
                  placeholderTextColor={Colors.muted}
                />
              </View>
            ))}
            <View style={styles.editModalActions}>
              <TouchableOpacity style={styles.editCancelBtn} onPress={() => setShowEditProfile(false)}>
                <Text style={styles.editCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editSaveBtn} onPress={saveProfile}>
                <Text style={styles.editSaveText}>Save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRight: { flexDirection: "row", gap: 10 },

  scrollContent: { paddingBottom: 32 },

  // Profile hero
  profileHero: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  profileHeroRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarEditBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  greetingLine: { fontSize: 14, color: Colors.muted },
  greetingNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  greetingName: { fontSize: 22, fontWeight: "800", color: Colors.dark },
  greetingWave: { fontSize: 20 },
  greetingTagline: { fontSize: 12, color: Colors.muted, marginTop: 2 },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  statsRowNarrow: { flexWrap: "wrap" },
  statCard: { flex: 1, minWidth: 86, alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 10, color: Colors.muted, textAlign: "center" },
  statDivider: { width: 1, backgroundColor: Colors.border },

  // Card
  card: {
    backgroundColor: Colors.white,
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: Colors.dark },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  editBtnText: { fontSize: 13, fontWeight: "600", color: Colors.primary },

  // Info row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  infoRowIcon: { width: 24 },
  infoRowLabel: { fontSize: 11, color: Colors.muted },
  infoRowValue: { fontSize: 14, fontWeight: "500", color: Colors.dark, flexShrink: 1 },

  // Reminder row
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderTitle: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  reminderSubtitle: { fontSize: 12, color: Colors.muted },
  reminderBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  reminderBadgeText: { fontSize: 12, fontWeight: "700" },
  reminderDate: { fontSize: 11, color: Colors.muted, marginTop: 4 },

  // Quick actions
  quickActionsSection: { marginTop: 12, marginHorizontal: 20 },
  quickActionsTitle: { fontSize: 16, fontWeight: "700", color: Colors.dark, marginBottom: 12 },
  quickActionsRow: { flexDirection: "row", gap: 10 },
  quickActionsRowNarrow: { flexWrap: "wrap" },
  quickActionBtn: {
    flex: 1,
    minWidth: 132,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  quickActionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  editModal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
  },
  editModalTitle: { fontSize: 18, fontWeight: "800", color: Colors.dark, marginBottom: 14 },
  editField: { marginBottom: 10 },
  editFieldLabel: { fontSize: 12, fontWeight: "700", color: Colors.muted, marginBottom: 5 },
  editInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.dark,
  },
  editModalActions: { flexDirection: "row", gap: 10, marginTop: 8 },
  editCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  editCancelText: { fontSize: 14, fontWeight: "700", color: Colors.muted },
  editSaveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  editSaveText: { fontSize: 14, fontWeight: "800", color: Colors.white },
});
