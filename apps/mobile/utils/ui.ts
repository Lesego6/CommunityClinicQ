import { Platform } from "react-native";

/**
 * Returns bottom padding to account for the fixed tab bar on web,
 * or standard safe-area padding on native.
 */
export function getBottomPadding(extra = 0): number {
  return (Platform.OS === "web" ? 80 : 24) + extra;
}

/**
 * Returns a time-of-day greeting string based on the current hour.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}
