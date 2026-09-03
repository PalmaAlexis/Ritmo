import type { ProjectStatusValues } from '@/shared/project/status';

interface RecentProjects {
  id: string;
  title: string;
  category: string;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksCount: number;
}
export interface GetRecentProjectsModel {
  projects: RecentProjects[];
}
