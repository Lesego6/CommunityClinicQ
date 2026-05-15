import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  location: string;
  language: string;
  bloodType: string;
  memberSince: string;
  avatar?: string;
}

export interface QueueTicket {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicAddress: string;
  queueNumber: string;
  serviceType: string;
  joinedAt: string;
  estimatedWait: string;
  peopleAhead: number;
  status: "waiting" | "almost" | "serving" | "done" | "cancelled";
  qrValue: string;
}

export interface Appointment {
  id: string;
  clinicId: string;
  clinicName: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed" | "cancelled";
  doctor?: string;
}

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  enabled: boolean;
  nextDue: string;
}

export interface Notification {
  id: string;
  type: "queue" | "appointment" | "medication" | "system" | "health";
  title: string;
  body: string;
  time: string;
  read: boolean;
  tag?: string;
  tagColor?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface AppState {
  // User
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Queue
  activeTicket: QueueTicket | null;
  queueHistory: QueueTicket[];
  joinQueue: (ticket: Omit<QueueTicket, "id" | "status" | "qrValue">) => QueueTicket;
  leaveQueue: () => void;
  updateTicketStatus: (status: QueueTicket["status"]) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, "id">) => Appointment;
  cancelAppointment: (id: string) => void;

  // Medications
  medicationReminders: MedicationReminder[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<MedicationReminder, "id">) => void;
  deleteReminder: (id: string) => void;

  // Notifications
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  addNotification: (notif: Omit<Notification, "id" | "read">) => void;

  // Emergency contacts
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (id: string) => void;

  // Selected clinic
  selectedClinicId: string | null;
  setSelectedClinic: (id: string | null) => void;

  // Onboarding
  onboardingComplete: boolean;
  completeOnboarding: () => void;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "appt-1",
    clinicId: "langa-community",
    clinicName: "Langa Community Clinic",
    service: "General Consultation",
    date: "Fri, 24 May 2026",
    time: "09:00 AM",
    duration: "15 min",
    status: "upcoming",
    doctor: "Dr. N. Dlamini",
  },
  {
    id: "appt-2",
    clinicId: "gugulethu",
    clinicName: "Gugulethu Clinic",
    service: "Follow-up Visit",
    date: "Mon, 27 May 2026",
    time: "10:30 AM",
    duration: "20 min",
    status: "upcoming",
    doctor: "Dr. S. Jacobs",
  },
  {
    id: "appt-3",
    clinicId: "langa-community",
    clinicName: "Langa Community Clinic",
    service: "Chronic Care",
    date: "Tue, 12 Apr 2026",
    time: "08:30 AM",
    duration: "20 min",
    status: "completed",
    doctor: "Dr. N. Dlamini",
  },
];

const INITIAL_REMINDERS: MedicationReminder[] = [
  {
    id: "rem-1",
    name: "Paracetamol 500mg",
    dosage: "1 tablet",
    frequency: "After breakfast",
    time: "08:00 AM",
    enabled: true,
    nextDue: "Today • 08:00 AM",
  },
  {
    id: "rem-2",
    name: "Amoxicillin 250mg",
    dosage: "1 capsule",
    frequency: "After lunch",
    time: "01:00 PM",
    enabled: true,
    nextDue: "Today • 01:00 PM",
  },
  {
    id: "rem-3",
    name: "Amlodipine 5mg",
    dosage: "1 tablet",
    frequency: "Once daily",
    time: "07:00 AM",
    enabled: false,
    nextDue: "Tomorrow • 07:00 AM",
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "queue",
    title: "You're 5 people away!",
    body: "Good news! You're next in line soon at Langa Community Clinic. Please be ready.",
    time: "09:35 AM",
    read: false,
    tag: "Queue • Langa Community Clinic",
    tagColor: "#1B6B3A",
  },
  {
    id: "n2",
    type: "appointment",
    title: "Appointment reminder",
    body: "You have an appointment tomorrow at 10:00 AM at Langa Community Clinic.",
    time: "08:15 AM",
    read: false,
    tag: "Appointment",
    tagColor: "#E8821A",
  },
  {
    id: "n3",
    type: "medication",
    title: "Medication ready for collection",
    body: "Your medication (Paracetamol 500mg) is ready for collection at Gugulethu Clinic Pharmacy.",
    time: "07:45 AM",
    read: false,
    tag: "Medication",
    tagColor: "#0D9488",
  },
  {
    id: "n4",
    type: "system",
    title: "Clinic update",
    body: "Walk-in services may be slower than usual today at Delft Community Clinic due to high patient volume.",
    time: "Yesterday, 11:20 AM",
    read: true,
    tag: "System",
    tagColor: "#6B7280",
  },
  {
    id: "n5",
    type: "health",
    title: "Health tip of the week",
    body: "Drink plenty of water, eat healthy and get enough rest. Small steps lead to a healthier you!",
    time: "Mon, 12 May, 09:00 AM",
    read: true,
    tag: "Health Tip",
    tagColor: "#DC2626",
  },
];

const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: "ec-1", name: "Nomsa Mthembu", relationship: "Mother", phone: "+27 82 456 7890" },
  { id: "ec-2", name: "Thabo Mthembu", relationship: "Brother", phone: "+27 73 234 5678" },
];

let idCounter = 1000;
const genId = () => `id-${++idCounter}`;

export const useAppStore = create<AppState>((set, get) => ({
  // User
  user: {
    name: "Sibongile Mthembu",
    phone: "+27 82 123 4567",
    email: "sibongile.m@example.com",
    location: "Cape Town, Western Cape",
    language: "English",
    bloodType: "O+",
    memberSince: "May 2024",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80",
  },
  updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),

  // Queue
  activeTicket: null,
  queueHistory: [],
  joinQueue: (ticketData) => {
    const ticket: QueueTicket = {
      ...ticketData,
      id: genId(),
      status: "waiting",
      qrValue: `CLINICQ-${ticketData.queueNumber}-${ticketData.clinicId.toUpperCase()}-${genId()}`,
    };
    set({ activeTicket: ticket });
    return ticket;
  },
  leaveQueue: () =>
    set((s) => ({
      activeTicket: null,
      queueHistory: s.activeTicket
        ? [{ ...s.activeTicket, status: "cancelled" }, ...s.queueHistory]
        : s.queueHistory,
    })),
  updateTicketStatus: (status) =>
    set((s) => ({
      activeTicket: s.activeTicket ? { ...s.activeTicket, status } : null,
    })),

  // Appointments
  appointments: INITIAL_APPOINTMENTS,
  addAppointment: (apptData) => {
    const appt: Appointment = { ...apptData, id: genId() };
    set((s) => ({ appointments: [appt, ...s.appointments] }));
    return appt;
  },
  cancelAppointment: (id) =>
    set((s) => ({
      appointments: s.appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" } : a
      ),
    })),

  // Medications
  medicationReminders: INITIAL_REMINDERS,
  toggleReminder: (id) =>
    set((s) => ({
      medicationReminders: s.medicationReminders.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    })),
  addReminder: (reminderData) =>
    set((s) => ({
      medicationReminders: [
        { ...reminderData, id: genId() },
        ...s.medicationReminders,
      ],
    })),
  deleteReminder: (id) =>
    set((s) => ({
      medicationReminders: s.medicationReminders.filter((r) => r.id !== id),
    })),

  // Notifications
  notifications: INITIAL_NOTIFICATIONS,
  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  clearAll: () => set({ notifications: [] }),
  addNotification: (notifData) =>
    set((s) => ({
      notifications: [{ ...notifData, id: genId(), read: false }, ...s.notifications],
    })),

  // Emergency contacts
  emergencyContacts: INITIAL_EMERGENCY_CONTACTS,
  addEmergencyContact: (contactData) =>
    set((s) => ({
      emergencyContacts: [...s.emergencyContacts, { ...contactData, id: genId() }],
    })),
  removeEmergencyContact: (id) =>
    set((s) => ({
      emergencyContacts: s.emergencyContacts.filter((c) => c.id !== id),
    })),

  // Selected clinic
  selectedClinicId: null,
  setSelectedClinic: (id) => set({ selectedClinicId: id }),

  // Onboarding
  onboardingComplete: true,
  completeOnboarding: () => set({ onboardingComplete: true }),
}));
