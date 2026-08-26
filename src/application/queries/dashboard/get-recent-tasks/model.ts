import type { TaskPriorityValues } from '../../../../shared/task/priority';
import type { TaskStatusValues } from '../../../../shared/task/status';

interface RecentTasks {
  title: string;
  projectTitle: string;
  startedAt: Date | null;
  priority: TaskPriorityValues;
  status: TaskStatusValues;
}

export interface GetRecentTasksModel {
  tasks: RecentTasks[];
}
