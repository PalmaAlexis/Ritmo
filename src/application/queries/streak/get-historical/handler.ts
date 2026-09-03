import { StreakDay } from '@/domain/aggregates/completion-event/streak-day.vo';
import type { GetStreakRepository } from '../repositories/get-streak.repository';
import type { GetStreakHistoricalQuery } from './query';
import type { GetStreakHistoricalResponse } from './response';

export class GetStreakHistoricalHandler {
  constructor(private readonly getStreakRepository: GetStreakRepository) {}

  async execute(query: GetStreakHistoricalQuery): Promise<GetStreakHistoricalResponse> {
    const fromDay = StreakDay.rehydrate(query.fromDay).toString();
    const toDay = StreakDay.rehydrate(query.toDay).toString();

    if (fromDay > toDay) throw new Error('Streak history start day must not be after end day');

    return await this.getStreakRepository.getHistorical(fromDay, toDay);
  }
}
