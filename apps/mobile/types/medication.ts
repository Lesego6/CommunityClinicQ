export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  enabled: boolean;
  nextDue: string;
}
