import type { ProjectStatusValues } from '../../../../shared/project/status';

export interface GetProjectBasicInfoModel {
  id: string;
  title: string;
  category: string;
  status: ProjectStatusValues;
}
