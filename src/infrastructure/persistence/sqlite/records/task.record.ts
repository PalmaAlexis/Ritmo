import type { TaskPriorityValues } from '../../../../shared/task/priority';
import type { TaskStatusValues } from '../../../../shared/task/status';

export interface SQLiteTaskRecord {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatusValues;
  priority: TaskPriorityValues;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  deletedAt: string | null;
  description: string | null;
}
