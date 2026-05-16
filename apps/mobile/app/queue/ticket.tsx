import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import QRCode from "react-native-qrcode-svg";
import { Colors } from "../../constants/colors";
import { ClinicQLogo } from "../../components/ui/ClinicQLogo";
import { useAppStore } from "../../stores/appStore";

function BackIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HelpIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={Colors.dark} strokeWidth={2} />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={Colors.dark} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function RefreshIcon({ size = 16, color = Colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 4V10H17M1 20V14H7M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ClockIcon({ size = 14, color = Colors.muted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
      <Path d="M12 7V12L15 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PeopleIcon({ color = Colors.primary, size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={3} stroke={color} strokeWidth={2} />
      <Path d="M3 20C3 17.2386 5.68629 15 9 15C12.3137 15 15 17.2386 15 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={17} cy={7} r={2.5} stroke={color} strokeWidth={1.5} />
      <Path d="M21 20C21 18.3431 19.2091 17 17 17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
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

function ShieldIcon({ size = 16, color = Colors.success }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 60, color = Colors.success }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill={color} />
      <Path d="M8 12L11 15L16 9" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
      <View style={{ width: 28 }}>{icon}</View>
      <Text style={{ flex: 1, fontSize: 13, color: Colors.muted }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.dark }}>{value}</Text>
    </View>
  );
}

function CheckInModal({ visible, onClose, clinicName, queueNumber, serviceType, estimatedWait, peopleAhead }: {
  visible: boolean;
  onClose: () => void;
  clinicName: string;
  queueNumber: string;
  serviceType: string;
  estimatedWait: string;
  peopleAhead: number;
}) {
  const [checkedIn, setCheckedIn] = useState(false);
  const updateTicketStatus = useAppStore((s) => s.updateTicketStatus);

  const handleCheckIn = () => {
    setCheckedIn(true);
    updateTicketStatus("almost");
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={["top"]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 }}>
          <TouchableOpacity onPress={onClose}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: "700", color: Colors.white }}>How to Check In</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          {!checkedIn ? (
            <>
              <View style={{ backgroundColor: Colors.white + "20", borderRadius: 20, padding: 20, alignItems: "center" }}>
                <Text style={{ fontSize: 80 }}>📱</Text>
                <Text style={{ fontSize: 14, color: Colors.white, textAlign: "center", marginTop: 8 }}>
                  Show your QR code at the clinic kiosk or reception
                </Text>
              </View>
              {[
                { num: 1, title: "Open your Queue Ticket", desc: "Tap on the ticket from your queue." },
                { num: 2, title: "Show QR Code", desc: "Present your QR code to the kiosk or staff." },
                { num: 3, title: "Scan to Check In", desc: "The kiosk or staff will scan your QR code." },
                { num: 4, title: "You're Checked In!", desc: "You will receive a confirmation and your place in the queue is saved." },
              ].map((step) => (
                <View key={step.num} style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: Colors.primary }}>{step.num}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.white }}>{step.title}</Text>
                    <Text style={{ fontSize: 13, color: Colors.white + "CC", marginTop: 2 }}>{step.desc}</Text>
                  </View>
                </View>
              ))}
              <View style={{ backgroundColor: Colors.white + "15", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
                <ShieldIcon size={18} color={Colors.white} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: Colors.white }}>Your data is safe and secure</Text>
                  <Text style={{ fontSize: 12, color: Colors.white + "CC" }}>We only use your information to manage the queue.</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleCheckIn}
                style={{ backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
              >
                <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: "700" }}>Simulate Check-In</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ alignItems: "center", gap: 20 }}>
              <Text style={{ fontSize: 40 }}>🎉</Text>
              <CheckCircleIcon size={80} color={Colors.white} />
              <Text style={{ fontSize: 24, fontWeight: "800", color: Colors.white, textAlign: "center" }}>
                Check-in Successful!
              </Text>
              <Text style={{ fontSize: 14, color: Colors.white + "CC", textAlign: "center" }}>
                You have been checked in for
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "700", color: Colors.yellow, textAlign: "center" }}>
                {serviceType}
              </Text>
              <Text style={{ fontSize: 14, color: Colors.white + "CC" }}>at {clinicName}</Text>
              <View style={{ backgroundColor: Colors.white + "20", borderRadius: 16, padding: 20, width: "100%", gap: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 12, color: Colors.white + "CC" }}>Your Queue Number</Text>
                    <Text style={{ fontSize: 36, fontWeight: "900", color: Colors.white }}>{queueNumber}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 12, color: Colors.white + "CC" }}>You are</Text>
                    <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.white }}>{peopleAhead} people away</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <ClockIcon size={14} color={Colors.white + "CC"} />
                  <Text style={{ fontSize: 13, color: Colors.white + "CC" }}>Estimated wait time: {estimatedWait}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: Colors.white + "CC", textAlign: "center" }}>
                🔔 We'll notify you when it's almost your turn.
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{ backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 16, alignItems: "center", width: "100%" }}
              >
                <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: "700" }}>Go to Queue Status</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: Colors.white + "CC", fontSize: 14 }}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyTicket() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 }}>
      <Text style={{ fontSize: 64 }}>🎫</Text>
      <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.dark, textAlign: "center" }}>No active queue ticket</Text>
      <Text style={{ fontSize: 14, color: Colors.muted, textAlign: "center", lineHeight: 20 }}>
        You haven't joined any queue yet. Find a nearby clinic and join the queue to get your ticket.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/queue/checkin")}
        style={{ backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32, marginTop: 8 }}
      >
        <Text style={{ color: Colors.white, fontSize: 15, fontWeight: "700" }}>Join a Queue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/nearby")}>
        <Text style={{ fontSize: 14, color: Colors.primary, fontWeight: "600" }}>Find nearby clinics</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function QueueTicketScreen() {
  const router = useRouter();
  const activeTicket = useAppStore((s) => s.activeTicket);
  const leaveQueue = useAppStore((s) => s.leaveQueue);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [qrKey, setQrKey] = useState(0);

  const handleLeaveQueue = () => {
    Alert.alert(
      "Leave Queue?",
      "Are you sure you want to leave the queue? You will lose your spot.",
      [
        { text: "Stay in queue", style: "cancel" },
        {
          text: "Leave queue",
          style: "destructive",
          onPress: () => {
            leaveQueue();
            router.replace("/queue");
          },
        },
      ]
    );
  };

  if (!activeTicket || activeTicket.status === "cancelled" || activeTicket.status === "done") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top"]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon size={22} />
          </TouchableOpacity>
          <ClinicQLogo size={28} />
          <View style={{ width: 22 }} />
        </View>
        <EmptyTicket />
      </SafeAreaView>
    );
  }

  const today = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }} edges={["top"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon size={22} />
        </TouchableOpacity>
        <ClinicQLogo size={28} />
        <TouchableOpacity onPress={() => setShowCheckIn(true)}>
          <HelpIcon size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* Success Banner */}
        <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: Colors.primary + "30" }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center" }}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17L4 12" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.success }}>You are in the queue!</Text>
            <Text style={{ fontSize: 12, color: Colors.muted }}>Show this QR code at the clinic to check in.</Text>
          </View>
        </View>

        {/* Ticket Card */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 20, padding: 24, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          {/* Clinic info */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>{activeTicket.clinicName}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <LocationIcon size={12} color={Colors.muted} />
                <Text style={{ fontSize: 12, color: Colors.muted }}>{activeTicket.clinicAddress}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: Colors.success }}>Open</Text>
            </View>
          </View>

          {/* Queue number */}
          <Text style={{ fontSize: 14, color: Colors.muted, marginBottom: 4 }}>Your Queue Number</Text>
          <Text style={{ fontSize: 72, fontWeight: "900", color: Colors.primary, lineHeight: 76 }}>{activeTicket.queueNumber}</Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.muted, marginBottom: 20 }}>{activeTicket.serviceType}</Text>

          {/* QR Code */}
          <View style={{ padding: 16, backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 }}>
            <QRCode
              value={activeTicket.qrValue}
              size={160}
              color={Colors.dark}
              backgroundColor={Colors.white}
            />
          </View>

          {/* Refresh QR */}
          <TouchableOpacity
            onPress={() => setQrKey((k) => k + 1)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 20 }}
          >
            <RefreshIcon size={14} color={Colors.primary} />
            <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>Refresh QR Code</Text>
          </TouchableOpacity>

          {/* Stats row */}
          <View style={{ flexDirection: "row", width: "100%", gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <PeopleIcon color={Colors.primary} size={16} />
              <View>
                <Text style={{ fontSize: 10, color: Colors.muted }}>You are</Text>
                <Text style={{ fontSize: 16, fontWeight: "800", color: Colors.dark }}>{activeTicket.peopleAhead} people away</Text>
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ClockIcon size={16} color={Colors.primary} />
              <View>
                <Text style={{ fontSize: 10, color: Colors.muted }}>Estimated wait</Text>
                <Text style={{ fontSize: 16, fontWeight: "800", color: Colors.dark }}>{activeTicket.estimatedWait}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* How it works */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.dark, marginBottom: 10 }}>ℹ How it works</Text>
          {[
            "Arrive at the clinic",
            "Scan this QR code at the kiosk or reception",
            "You will be checked in instantly",
            "Wait for your number to be called",
          ].map((step, i) => (
            <Text key={i} style={{ fontSize: 12, color: Colors.muted, marginBottom: 4 }}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>

        {/* Queue Details */}
        <View style={{ backgroundColor: Colors.white, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 4 }}>Queue Details</Text>
          <DetailRow
            icon={<Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={8} r={4} stroke={Colors.primary} strokeWidth={2} /><Path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" /></Svg>}
            label="Service"
            value={activeTicket.serviceType}
          />
          <DetailRow
            icon={<Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Rect x={3} y={4} width={18} height={18} rx={2} stroke={Colors.primary} strokeWidth={2} /><Path d="M3 9H21M8 2V6M16 2V6" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" /></Svg>}
            label="Date"
            value={today}
          />
          <DetailRow
            icon={<ClockIcon size={16} color={Colors.primary} />}
            label="Time Joined"
            value={activeTicket.joinedAt}
          />
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
            <View style={{ width: 28 }}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={3} width={18} height={18} rx={3} stroke={Colors.primary} strokeWidth={2} />
                <Path d="M8 8H16M8 12H16M8 16H12" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={{ flex: 1, fontSize: 13, color: Colors.muted }}>Queue ID</Text>
            <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.dark }}>{activeTicket.id.slice(-8).toUpperCase()}</Text>
          </View>
        </View>

        {/* Notification note */}
        <View style={{ backgroundColor: Colors.yellowLight, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 16 }}>🔔</Text>
          <Text style={{ fontSize: 13, color: Colors.warning, fontWeight: "500" }}>
            We'll notify you as you move up in the queue.
          </Text>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setShowCheckIn(true)}
            style={{ flex: 2, backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
          >
            <Text style={{ color: Colors.white, fontSize: 15, fontWeight: "700" }}>How to Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLeaveQueue}
            style={{ flex: 1, backgroundColor: Colors.redLight, borderRadius: 16, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: Colors.danger + "30" }}
          >
            <Text style={{ color: Colors.danger, fontSize: 14, fontWeight: "700" }}>Leave Queue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CheckInModal
        visible={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        clinicName={activeTicket.clinicName}
        queueNumber={activeTicket.queueNumber}
        serviceType={activeTicket.serviceType}
        estimatedWait={activeTicket.estimatedWait}
        peopleAhead={activeTicket.peopleAhead}
      />
    </SafeAreaView>
  );
}
