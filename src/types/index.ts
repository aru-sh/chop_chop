export interface Priority {
  id: string;
  text: string;
  order: number;
  completed: boolean;
  subnote: string;
  createdAt: string;
  completedAt?: string;
}

export interface RecurringReminder {
  id: string;
  title: string;
  notes?: string;
  intervalType: 'minutes' | 'hours' | 'days';
  intervalValue: number;
  isActive: boolean;
  createdAt: string;
  nextReminderAt: string;
  lastReminderAt?: string;
  soundEnabled: boolean;
  soundVolume: number;
}

export interface DayData {
  date: string;
  priorities: Priority[];
  recurringReminders: RecurringReminder[];
}