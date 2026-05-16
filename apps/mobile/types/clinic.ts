export type TrafficLevel = "busy" | "moderate" | "low";

export interface Clinic {
  id: string;
  num: number;
  name: string;
  area: string;
  phone?: string;
  distance: string;
  waitTime: string;
  trafficLevel: TrafficLevel;
  trafficLabel: string;
  services: string[];
  stockHighlights?: Array<{
    name: string;
    status: "in-stock" | "low-stock" | "out-of-stock";
    detail?: string;
  }>;
  rating: number;
  reviews: number;
  imageIndex: number;
}

export interface MedicationClinicResult {
  clinicId: string;
  clinicName: string;
  area: string;
  distance: string;
  medName: string;
  form: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  detail: string;
  imageIndex: number;
}
