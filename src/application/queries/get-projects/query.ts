import type { ProjectStatusValues } from '../../../shared/project/status';

export interface GetProjectsQuery {
  page: number;
  pageSize: number;
  status: ProjectStatusValues | null;
}
