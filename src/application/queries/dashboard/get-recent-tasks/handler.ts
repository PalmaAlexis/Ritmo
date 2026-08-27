import type { DashboardRepository } from '../repositories/dashboard.repository';
import type { GetRecentTasksQuery } from './query';
import type { GetRecentTasksResponse } from './response';

export class GetRecentTasksHandler {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(query: GetRecentTasksQuery): Promise<GetRecentTasksResponse> {
    return this.dashboardRepository.getRecentTasks(query.limit);
  }
}
