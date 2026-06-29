import type { TaskPriorityValues } from '../../../../shared/task/priority';
import type { TaskStatusValues } from '../../../../shared/task/status';

interface TasksInfo {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatusValues;
  priority: TaskPriorityValues;
}

export interface GetTasksByProjectResponse {
  tasksTotalCount: number;
  tasksToDoCount: number;
  tasksInProgressCount: number;
  tasksDoneCount: number;
  tasks: TasksInfo[];
}
