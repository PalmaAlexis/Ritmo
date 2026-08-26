import type { DashboardRepository } from '../repositories/dashboard.repository';
import type { GetDashboardSummaryQuery } from './query';
import type { GetDashboardSummaryResponse } from './response';

export class GetDashboardSummaryHandler {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(_query: GetDashboardSummaryQuery): Promise<GetDashboardSummaryResponse> {
    return await this.dashboardRepository.getSummary();
  }
}
