/**
 * Shared clinic data and images used across Home, Nearby, and Medications screens.
 * Replace with a real API call when the backend is ready.
 */

import type { Clinic, MedicationClinicResult, TrafficLevel } from "../types/clinic";

// Re-export so existing imports from this file keep working
export type { Clinic, MedicationClinicResult, TrafficLevel } from "../types/clinic";

export const CLINIC_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=120&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=120&q=80",
];

export const CLINICS: Clinic[] = [
  {
    id: "langa-community",
    num: 1,
    name: "Langa Community Clinic",
    area: "Langa, Cape Town",
    phone: "+27216950001",
    distance: "1.2 km",
    waitTime: "35–45 min",
    trafficLevel: "busy",
    trafficLabel: "High traffic now",
    services: ["General Services", "Chronic Care", "Immunization"],
    stockHighlights: [
      { name: "Paracetamol 500mg", status: "in-stock", detail: "120+ packs" },
      { name: "Amlodipine 5mg", status: "in-stock", detail: "40 packs" },
      { name: "Amoxicillin 250mg", status: "low-stock", detail: "12 packs left" },
    ],
    rating: 4.6,
    reviews: 128,
    imageIndex: 0,
  },
  {
    id: "gugulethu",
    num: 2,
    name: "Gugulethu Clinic",
    area: "Gugulethu, Cape Town", // fixed typo from "Guguitu"
    phone: "+27216330002",
    distance: "2.4 km",
    waitTime: "15–20 min",
    trafficLevel: "moderate",
    trafficLabel: "Normal traffic",
    services: ["General Services", "Maternal Care", "Pharmacy"],
    stockHighlights: [
      { name: "Paracetamol 500mg", status: "low-stock", detail: "12 packs left" },
      { name: "Iron supplement", status: "in-stock", detail: "60 packs" },
      { name: "Metformin 500mg", status: "in-stock", detail: "35 packs" },
    ],
    rating: 4.4,
    reviews: 96,
    imageIndex: 1,
  },
  {
    id: "nyanga-day",
    num: 3,
    name: "Nyanga Day Clinic",
    area: "Nyanga, Cape Town",
    phone: "+27213860003",
    distance: "3.1 km",
    waitTime: "5–10 min",
    trafficLevel: "low",
    trafficLabel: "Light traffic",
    services: ["General Services", "Child Health", "TB Care"],
    stockHighlights: [
      { name: "Paracetamol 500mg", status: "out-of-stock", detail: "Check later" },
      { name: "TB medication", status: "in-stock", detail: "Available" },
      { name: "ORS sachets", status: "in-stock", detail: "80 packs" },
    ],
    rating: 4.5,
    reviews: 74,
    imageIndex: 2,
  },
  {
    id: "delft-community",
    num: 4,
    name: "Delft Community Clinic",
    area: "Delft, Cape Town",
    phone: "+27219540004",
    distance: "4.8 km",
    waitTime: "20–30 min",
    trafficLevel: "moderate",
    trafficLabel: "Normal traffic",
    services: ["General Services", "Women's Health", "Pharmacy"],
    stockHighlights: [
      { name: "Prenatal vitamins", status: "in-stock", detail: "55 packs" },
      { name: "Ibuprofen 400mg", status: "low-stock", detail: "9 packs left" },
      { name: "Salbutamol Inhaler", status: "out-of-stock", detail: "Check later" },
    ],
    rating: 4.3,
    reviews: 59,
    imageIndex: 3,
  },
];

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
