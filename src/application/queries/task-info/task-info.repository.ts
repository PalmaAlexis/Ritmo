import type { GetTaskInfoModel } from './model';

export interface TaskInfoRepository {
  getTaskInfo(id: string): Promise<GetTaskInfoModel>;
}
