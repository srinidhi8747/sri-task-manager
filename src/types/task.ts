
export interface Task {
  id: number;
  sequence: number;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  completed: boolean;
  createdAt: string;
  createdBy: string;
  completedAt?: string | null;
  priority: 'low' | 'medium' | 'high';
}

export type Priority = 'low' | 'medium' | 'high';
export type SortField = 'title' | 'createdAt' | 'priority' | 'due';
export type SortDirection = 'asc' | 'desc';
