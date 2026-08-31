import type { ProjectColorValues } from '../../../../../shared/project-ui/color';
import type { ProjectIconValues } from '../../../../../shared/project-ui/icon';
import type { ProjectStatusValues } from '../../../../../shared/project/status';
import type { TaskPriorityValues } from '../../../../../shared/task/priority';
import type { TaskStatusValues } from '../../../../../shared/task/status';

export interface SQLiteProjectBasicInfoRecord {
  id: string;
  title: string;
  category: string;
  status: ProjectStatusValues;
}

export interface SQLiteProjectStatsRecord {
  allTasksCount: number;
  completedTasksCount: number;
  inProgressTasksCount: number;
  toDoTasksCount: number;
}

export interface SQLiteProjectTaskRecord {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatusValues;
  priority: TaskPriorityValues;
}

export interface SQLiteProjectDetailsRecord {
  id: string;
  status: ProjectStatusValues;
  createdAt: string;
  startedAt: string | null;
  description: string;
  icon: ProjectIconValues;
  color: ProjectColorValues;
}

export interface SQLiteProjectExistsRecord {
  exists: number;
}
