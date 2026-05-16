import "../global.css";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../constants/colors";

const NO_FLOATING_BACK = new Set([
  "/",
  "/home",
  "/nearby",
  "/queue",
  "/medications",
  "/profile",
  "/auth/phone",
  "/auth/otp",
  "/onboarding/welcome",
  "/onboarding/tutorial",
  "/onboarding/permissions",
  "/clinic/directions",
  "/clinic/reviews",
  "/queue/checkin",
  "/queue/ticket",
  "/emergency",
]);

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19L5 12L12 5" stroke={Colors.dark} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FloatingBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const hidden = NO_FLOATING_BACK.has(pathname);

  if (hidden) return null;

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={{
        position: "absolute",
        top: insets.top + 10,
        left: 14,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.white,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.16)",
        elevation: 8,
      }}
    >
      <BackIcon />
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
        <FloatingBackButton />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
