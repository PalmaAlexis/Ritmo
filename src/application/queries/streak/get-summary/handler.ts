import type { GetStreakRepository } from '../repositories/get-streak.repository';
import type { GetStreakSummaryQuery } from './query';
import type { GetStreakSummaryResponse } from './response';

export class GetStreakSummaryHandler {
  constructor(private readonly getStreakRepository: GetStreakRepository) {}

  async execute(_query: GetStreakSummaryQuery): Promise<GetStreakSummaryResponse> {
    return await this.getStreakRepository.getSummary();
  }
}
