import type { ProjectStatusValues } from '@/shared/project/status';
import type { ProjectColorValues } from '@/shared/project-ui/color';
import type { ProjectIconValues } from '@/shared/project-ui/icon';
import type { TaskPriorityValues } from '@/shared/task/priority';
import type { TaskStatusValues } from '@/shared/task/status';

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
  color: ProjectColorValues;
  icon: ProjectIconValues;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksCount: number;
}

export interface SQLiteRecentTaskRecord {
  id: string;
  projectId: string;
  title: string;
  projectTitle: string;
  startedAt: string | null;
  finishedAt: string | null;
  priority: TaskPriorityValues;
  status: TaskStatusValues;
}
