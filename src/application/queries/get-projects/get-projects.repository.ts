import type { ProjectStatusValues } from '@/shared/project/status';
import type { GetProjectsModel } from './model';

export interface GetProjectsRepository {
  getProjects(
    page: number,
    pageSize: number,
    status: ProjectStatusValues | null
  ): Promise<GetProjectsModel>;
}
