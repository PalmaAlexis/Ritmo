import type { GetRecentProjectsModel } from '../get-recent-projects/model';
import type { GetRecentTasksModel } from '../get-recent-tasks/model';
import type { GetDashboardSummaryModel } from '../get-summary/model';
import type { GetWeeklyCountModel } from '../get-weekly-count/model';

export interface DashboardRepository {
  getSummary(): Promise<GetDashboardSummaryModel>;
  getWeeklyCount(): Promise<GetWeeklyCountModel>;
  getRecentProjects(limit: number): Promise<GetRecentProjectsModel>;
  getRecentTasks(limit: number): Promise<GetRecentTasksModel>;
}
