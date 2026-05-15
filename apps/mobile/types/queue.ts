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
