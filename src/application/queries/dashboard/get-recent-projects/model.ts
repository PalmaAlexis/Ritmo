import type { ProjectStatusValues } from '@/shared/project/status';
import type { ProjectColorValues } from '@/shared/project-ui/color';
import type { ProjectIconValues } from '@/shared/project-ui/icon';

interface RecentProjects {
  id: string;
  title: string;
  category: string;
  color: ProjectColorValues;
  icon: ProjectIconValues;
  status: ProjectStatusValues;
  allTasksCount: number;
  completedTasksCount: number;
}
export interface GetRecentProjectsModel {
  projects: RecentProjects[];
}
