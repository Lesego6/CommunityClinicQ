import { create } from "zustand";

export type LocationCoords = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

export type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "error";

interface SettingsState {
  /** Cached device coordinates — shared across all screens. */
  coords: LocationCoords | null;
  locationStatus: LocationStatus;
  locationError: string | null;

  setCoords: (coords: LocationCoords) => void;
  setLocationStatus: (status: LocationStatus) => void;
  setLocationError: (error: string | null) => void;
}

/**
 * Intentionally NOT persisted — location is cheap to re-fetch and stale
 * coordinates are worse than no coordinates.
 */
export const useSettingsStore = create<SettingsState>()((set) => ({
  coords: null,
  locationStatus: "idle",
  locationError: null,

  setCoords: (coords) => set({ coords }),
  setLocationStatus: (status) => set({ locationStatus: status }),
  setLocationError: (error) => set({ locationError: error }),
}));
