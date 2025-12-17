export type LifeEventType = 'marriage' | 'birth' | 'job' | 'startup' | 'moving' | 'care';

export interface LifeEvent {
  id: LifeEventType;
  title: string;
  description: string;
  icon: string;
  color: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'government' | 'benefit' | 'private';
  deadline?: string;
  estimatedTime: string;
  requiredDocs: string[];
  submitTo: string;
  isOnline: boolean;
  benefitAmount?: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  officialUrl?: string; // Link to actual government site or PDF
}

export interface UserProgress {
  eventId: LifeEventType;
  completedTasks: string[];
  totalBenefitsClaimed: number;
  startDate: string;
}
