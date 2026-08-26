import type { DashboardRepository } from '../repositories/dashboard.repository';
import type { GetWeeklyCountQuery } from './query';
import type { GetWeeklyCountResponse } from './response';

export class GetWeeklyCountHandler {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(_query: GetWeeklyCountQuery): Promise<GetWeeklyCountResponse> {
    return await this.dashboardRepository.getWeeklyCount();
  }
}
