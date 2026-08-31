import type { ProjectStatusValues } from '../../../../../shared/project/status';

export interface SQLiteProjectListItemRecord {
  id: string;
  title: string;
  category: string;
  status: ProjectStatusValues;
  icon: string;
  color: string;
  allTasksCount: number;
  completedTasksCount: number;
}
