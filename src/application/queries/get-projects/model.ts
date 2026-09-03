import type { ProjectStatusValues } from '@/shared/project/status';

interface Project {
  id: string;
  title: string;
  category: string;
  status: ProjectStatusValues;
  icon: string;
  color: string;
  allTasksCount: number;
  completedTasksCount: number;
}

export interface GetProjectsModel {
  projects: Project[];
}
