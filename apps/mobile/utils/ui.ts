import { Platform } from "react-native";

/**
 * Returns bottom padding to account for the fixed tab bar on web,
 * or standard safe-area padding on native.
 */
export function getBottomPadding(extra = 0): number {
  return (Platform.OS === "web" ? 104 : 96) + extra;
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

/**
 * React Navigation hides inactive web routes with aria-hidden. Blur the tapped
 * control first so focus does not remain inside a hidden route after navigation.
 */
export function blurActiveElement(): void {
  if (Platform.OS !== "web") return;

  const activeElement = globalThis.document?.activeElement;
  if (activeElement && "blur" in activeElement) {
    (activeElement as HTMLElement).blur();
  }
}

export function navigateWithBlur(
  router: { push: (href: any) => void },
  href: string
): void {
  blurActiveElement();
  router.push(href as any);
}
