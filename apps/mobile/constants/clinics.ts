/**
 * Shared clinic data and images used across Home, Nearby, and Medications screens.
 * Replace with a real API call when the backend is ready.
 */

export const CLINIC_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=120&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=120&q=80",
];

export type TrafficLevel = "busy" | "moderate" | "low";

export interface Clinic {
  id: string;
  num: number;
  name: string;
  area: string;
  distance: string;
  waitTime: string;
  trafficLevel: TrafficLevel;
  trafficLabel: string;
  services: string[];
  rating: number;
  reviews: number;
  imageIndex: number;
}

export const CLINICS: Clinic[] = [
  {
    id: "langa-community",
    num: 1,
    name: "Langa Community Clinic",
    area: "Langa, Cape Town",
    distance: "1.2 km",
    waitTime: "35–45 min",
    trafficLevel: "busy",
    trafficLabel: "High traffic now",
    services: ["General Services", "Chronic Care", "Immunization"],
    rating: 4.6,
    reviews: 128,
    imageIndex: 0,
  },
  {
    id: "gugulethu",
    num: 2,
    name: "Gugulethu Clinic",
    area: "Gugulethu, Cape Town", // fixed typo from "Guguitu"
    distance: "2.4 km",
    waitTime: "15–20 min",
    trafficLevel: "moderate",
    trafficLabel: "Normal traffic",
    services: ["General Services", "Maternal Care", "Pharmacy"],
    rating: 4.4,
    reviews: 96,
    imageIndex: 1,
  },
  {
    id: "nyanga-day",
    num: 3,
    name: "Nyanga Day Clinic",
    area: "Nyanga, Cape Town",
    distance: "3.1 km",
    waitTime: "5–10 min",
    trafficLevel: "low",
    trafficLabel: "Light traffic",
    services: ["General Services", "Child Health", "TB Care"],
    rating: 4.5,
    reviews: 74,
    imageIndex: 2,
  },
  {
    id: "delft-community",
    num: 4,
    name: "Delft Community Clinic",
    area: "Delft, Cape Town",
    distance: "4.8 km",
    waitTime: "20–30 min",
    trafficLevel: "moderate",
    trafficLabel: "Normal traffic",
    services: ["General Services", "Women's Health", "Pharmacy"],
    rating: 4.3,
    reviews: 59,
    imageIndex: 3,
  },
];

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

export const MEDICATION_NEARBY_RESULTS: MedicationClinicResult[] = [
  {
    clinicId: "langa-community",
    clinicName: "Langa Community Clinic",
    area: "Langa, Cape Town",
    distance: "1.2 km",
    medName: "Paracetamol 500mg",
    form: "Tablet",
    status: "in-stock",
    detail: "120+ packs",
    imageIndex: 0,
  },
  {
    clinicId: "gugulethu",
    clinicName: "Gugulethu Clinic",
    area: "Gugulethu, Cape Town",
    distance: "2.4 km",
    medName: "Paracetamol 500mg",
    form: "Tablet",
    status: "low-stock",
    detail: "12 packs left",
    imageIndex: 1,
  },
  {
    clinicId: "nyanga-day",
    clinicName: "Nyanga Day Clinic",
    area: "Nyanga, Cape Town",
    distance: "3.1 km",
    medName: "Paracetamol 500mg",
    form: "Tablet",
    status: "out-of-stock",
    detail: "Check later",
    imageIndex: 2,
  },
];
