import type { GetMostUsedLabelsModel } from '../get-most-used-labels/model';

export interface CreateTaskRepository {
  getMostUsedLabels(limit: number): Promise<GetMostUsedLabelsModel>;
}
