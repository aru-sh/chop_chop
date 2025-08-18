export interface Priority {
  id: string;
  text: string;
  order: number;
  completed: boolean;
  subnote: string;
  createdAt: string;
  completedAt?: string;
}

export interface DayData {
  date: string;
  priorities: Priority[];
}