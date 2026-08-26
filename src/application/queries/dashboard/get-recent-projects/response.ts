import type { ProjectCategory } from '../../../../domain/aggregates/project/category.vo';
import type { ProjectStatusValues } from '../../../../shared/project/status';

interface RecentProject {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksPercentage: number;
}

export interface GetRecentProjectsResponse {
  projects: RecentProject[];
}
