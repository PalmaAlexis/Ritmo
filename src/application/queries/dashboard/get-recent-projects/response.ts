import type { ProjectStatusValues } from '@/shared/project/status';
import type { ProjectColorValues } from '@/shared/project-ui/color';
import type { ProjectIconValues } from '@/shared/project-ui/icon';

interface RecentProject {
  id: string;
  title: string;
  category: string;
  color: ProjectColorValues;
  icon: ProjectIconValues;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksPercentage: number;
}

export interface GetRecentProjectsResponse {
  projects: RecentProject[];
}
