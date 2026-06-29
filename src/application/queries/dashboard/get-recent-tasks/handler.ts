import type { GetRecentProjectsQuery } from '../get-recent-projects/query';
import type { DashboardRepository } from '../repositories/dashboard.repository';
import type { GetRecentTasksResponse } from './response';

export class GetRecentTasksHandler {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(query: GetRecentProjectsQuery): Promise<GetRecentTasksResponse> {
    return this.dashboardRepository.getRecentTasks(query.limit);
  }
}
