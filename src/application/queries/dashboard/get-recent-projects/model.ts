import type { ProjectCategory } from '../../../../domain/aggregates/project/category.vo';
import type { ProjectStatusValues } from '../../../../shared/project/status';

interface RecentProjects {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksCount: number;
}
export interface GetRecentProjectsModel {
  projects: RecentProjects[];
}
