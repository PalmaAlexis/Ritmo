import type { GetProjectBasicInfoModel } from '../get-basic-info/model';
import type { GetProjectDetailsModel } from '../get-details/model';
import type { GetProjectStatsModel } from '../get-stats/model';
import type { GetTasksByProjectModel } from '../get-tasks/model';

export interface ProjectInfoRepository {
  getBasicInfo(id: string): Promise<GetProjectBasicInfoModel>;
  getStats(id: string): Promise<GetProjectStatsModel>;
  getTasks(id: string): Promise<GetTasksByProjectModel>;
  getDetails(id: string): Promise<GetProjectDetailsModel>;
}
