import { Tabs } from "expo-router";
import { View, Text, Platform, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { Colors } from "../../constants/colors";
import { useAppStore } from "../../stores/appStore";

const tabBarStyle = {
  backgroundColor: "#fff",
  borderTopColor: Colors.border,
  borderTopWidth: 1,
  height: Platform.OS === "ios" ? 96 : Platform.OS === "web" ? 92 : 88,
  paddingBottom: Platform.OS === "ios" ? 26 : Platform.OS === "web" ? 18 : 16,
  paddingTop: 8,
  ...(Platform.OS === "web"
    ? {
        position: "fixed" as any,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: "0 -3px 14px rgba(15, 23, 42, 0.10)",
        overflow: "visible" as const,
      }
    : {
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      }),
};

// ─── Tab Icon Components ─────────────────────────────────────────────────────

function HomeIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color === Colors.primary ? Colors.primaryLight : "none"}
      />
    </Svg>
  );
}

function NearbyIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
        stroke={color}
        strokeWidth={2}
        fill={color === Colors.primary ? Colors.primaryLight : "none"}
      />
      <Circle cx={12} cy={9} r={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function QueueIcon({
  color,
  size = 24,
  badge,
}: {
  color: string;
  size?: number;
  badge?: number;
}) {
  return (
    <View style={{ position: "relative" }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x={3}
          y={3}
          width={18}
          height={18}
          rx={3}
          stroke={color}
          strokeWidth={2}
          fill={color === Colors.primary ? Colors.primaryLight : "none"}
        />
        <Path
          d="M8 8H16M8 12H16M8 16H12"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
      {badge !== undefined && (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

function MedicationsIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={8}
        width={18}
        height={13}
        rx={2}
        stroke={color}
        strokeWidth={2}
        fill={color === Colors.primary ? Colors.primaryLight : "none"}
      />
      <Path
        d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M12 12V17M9.5 14.5H14.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ProfileIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={8}
        r={4}
        stroke={color}
        strokeWidth={2}
        fill={color === Colors.primary ? Colors.primaryLight : "none"}
      />
      <Path
        d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const tabStyles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});

export default function TabsLayout() {
  const activeTicket = useAppStore((s) => s.activeTicket);
  const unreadCount = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const hasActiveQueue = activeTicket && activeTicket.status !== "cancelled" && activeTicket.status !== "done";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          lineHeight: 13,
          marginTop: 1,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          height: 58,
          paddingTop: 2,
          paddingBottom: 0,
          justifyContent: "center",
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: "Nearby",
          tabBarIcon: ({ color }) => <NearbyIcon color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          title: "Queue",
          tabBarIcon: ({ color }) => <QueueIcon color={color} size={21} badge={hasActiveQueue ? 1 : undefined} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: "Medications",
          tabBarIcon: ({ color }) => <MedicationsIcon color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <ProfileIcon color={color} size={21} />,
        }}
      />
    </Tabs>
  );
}
