import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAppStore } from "../stores/appStore";
import { useAuthStore } from "../stores/authStore";
import { Colors } from "../constants/colors";

/**
 * Root entry point — decides where to send the user on launch.
 *
 * Both persist stores rehydrate from AsyncStorage asynchronously. We must
 * wait for both to finish before reading any persisted values, otherwise
 * every returning user gets a false-flash to /onboarding/welcome while the
 * stores still hold their initial (false) defaults.
 *
 * Flow once hydrated:
 *   Authenticated                               →  /(tabs)/home
 *   Not authenticated + onboarding not done     →  /onboarding/welcome
 *   Not authenticated + onboarding done         →  /auth/phone
 */
export default function Index() {
  const appHydrated = useAppStore((s) => s._hasHydrated);
  const authHydrated = useAuthStore((s) => s._hasHydrated);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  // Render nothing (splash-like) until both stores have loaded from storage.
  if (!appHydrated || !authHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.white }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/auth/phone" />;
}
