import type { ProjectStatusValues } from '../../../../../shared/project/status';

export interface SQLiteProjectRecord {
  id: string;
  title: string;
  status: ProjectStatusValues;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  deletedAt: string | null;
  description: string | null;
  category: string;
  icon: string;
  color: string;
}
