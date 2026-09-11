import type { TaskPriorityValues } from '@/shared/task/priority';
import type { TaskStatusValues } from '@/shared/task/status';

interface RecentTasks {
  id: string;
  projectId: string;
  title: string;
  projectTitle: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  priority: TaskPriorityValues;
  status: TaskStatusValues;
}

export interface GetRecentTasksModel {
  tasks: RecentTasks[];
}
