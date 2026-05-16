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
    return <Redirect href="/home" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/auth/phone" />;
}

