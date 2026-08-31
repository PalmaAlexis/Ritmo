import type { TaskPriorityValues } from '../../../../../shared/task/priority';
import type { TaskStatusValues } from '../../../../../shared/task/status';

export interface SQLiteTaskInfoRecord {
  id: string;
  projectTitle: string;
  title: string;
  status: TaskStatusValues;
  priority: TaskPriorityValues;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  description: string;
}

export interface SQLiteTaskInfoLabelRecord {
  id: string;
  name: string;
  color: string;
}
