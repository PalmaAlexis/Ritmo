import type { ProjectStatusValues } from '../../../../../shared/project/status';
import type { TaskPriorityValues } from '../../../../../shared/task/priority';
import type { TaskStatusValues } from '../../../../../shared/task/status';

export interface SQLiteDashboardProjectSummaryRecord {
  activeProjects: number;
  completedProjects: number;
}

export interface SQLiteDashboardTaskSummaryRecord {
  activeTasks: number;
  completedTasks: number;
}

export interface SQLiteWeeklyTaskCountRecord {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface SQLiteRecentProjectRecord {
  id: string;
  title: string;
  category: string;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksCount: number;
}

export interface SQLiteRecentTaskRecord {
  title: string;
  projectTitle: string;
  startedAt: string | null;
  priority: TaskPriorityValues;
  status: TaskStatusValues;
}
