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

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
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
