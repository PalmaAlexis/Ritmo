import type { TaskPriorityValues } from '../../../../shared/task/priority';
import type { TaskStatusValues } from '../../../../shared/task/status';

export interface TasksInfoByProject {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatusValues;
  priority: TaskPriorityValues;
}

export interface GetTasksByProjectModel {
  tasks: TasksInfoByProject[];
}
