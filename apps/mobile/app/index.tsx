import { View, ActivityIndicator } from "react-native";
import { Redirect, useRootNavigationState } from "expo-router";
import { useAppStore } from "../stores/appStore";
import { useAuthStore } from "../stores/authStore";
import { Colors } from "../constants/colors";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  
  const appHydrated = useAppStore((s) => s._hasHydrated);
  const authHydrated = useAuthStore((s) => s._hasHydrated);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  // Wait for persist stores and the Expo Router navigation tree to be fully hydrated
  if (!appHydrated || !authHydrated || !rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.white }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Once ready, we safely Redirect
  if (isAuthenticated) {
    if (role === "admin") {
      return <Redirect href="/admin-dashboard" />;
    }
    return <Redirect href="/(tabs)/home" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/auth/phone" />;
}

