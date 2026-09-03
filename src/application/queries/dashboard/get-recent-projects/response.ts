import type { ProjectStatusValues } from '@/shared/project/status';

interface RecentProject {
  id: string;
  title: string;
  category: string;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksPercentage: number;
}

export interface GetRecentProjectsResponse {
  projects: RecentProject[];
}
