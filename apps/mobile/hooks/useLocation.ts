import { useCallback, useEffect } from "react";
import * as Location from "expo-location";
import { useSettingsStore, type LocationCoords, type LocationStatus } from "../stores/settingsStore";

export type { LocationCoords, LocationStatus };

export interface UseLocationReturn {
  coords: LocationCoords | null;
  status: LocationStatus;
  error: string | null;
  /** Re-request permission and fetch the current position. */
  refresh: () => Promise<void>;
}

/**
 * Requests foreground location permission and returns the device's current
 * coordinates. Results are written into settingsStore so every screen that
 * calls useLocation() shares a single fetch — no duplicate permission prompts
 * or redundant GPS requests.
 *
 * Usage:
 *   const { coords, status, error, refresh } = useLocation();
 */
export function useLocation(): UseLocationReturn {
  const coords = useSettingsStore((s) => s.coords);
  const status = useSettingsStore((s) => s.locationStatus);
  const error = useSettingsStore((s) => s.locationError);
  const setCoords = useSettingsStore((s) => s.setCoords);
  const setStatus = useSettingsStore((s) => s.setLocationStatus);
  const setError = useSettingsStore((s) => s.setLocationError);

  const fetchLocation = useCallback(async () => {
    // Skip if we already have a fresh fix — avoids re-prompting on every render.
    if (useSettingsStore.getState().locationStatus === "granted") return;

    setStatus("requesting");
    setError(null);

    try {
      const { status: permStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permStatus !== "granted") {
        setStatus("denied");
        setError("Location permission was denied.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setStatus("granted");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to get location.");
    }
  }, [setCoords, setError, setStatus]);

  // Only fetch on mount if we don't already have coords.
  useEffect(() => {
    if (status === "idle") {
      fetchLocation();
    }
  }, [fetchLocation, status]);

  return { coords, status, error, refresh: fetchLocation };
}
