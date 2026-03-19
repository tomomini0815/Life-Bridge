export type LifeEventType = 'marriage' | 'birth' | 'job' | 'startup' | 'moving' | 'care' | 'divorce' | 'exam' | 'finance' | 'inheritance' | 'homePurchase';

export interface LifeEvent {
  id: LifeEventType;
  title: string;
  description: string;
  icon: string;
  color: string;
  tasks: Task[];
  group?: 'family' | 'career' | 'life' | 'money'; // For sidebar grouping
  taskGroups?: { id: string; title: string }[]; // For tabbed views (e.g. Purchase vs Sale)
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
  benefitId?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  officialUrl?: string;
  urgencyScore?: number; // 1-5: AI diagnosis urgency level
  riskFlags?: string[]; // Overlooked warnings (法的・財務・手続き上のリスク)
  groupId?: string; // To which task group this task belongs
}

export interface UserProgress {
  eventId: LifeEventType;
  completedTasks: string[];
  totalBenefitsClaimed: number;
  startDate: string;
}
