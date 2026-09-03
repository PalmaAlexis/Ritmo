import { StreakDay } from '@/domain/aggregates/completion-event/streak-day.vo';
import type { GetStreakRepository } from '../repositories/get-streak.repository';
import type { GetCompletionEventsByDayQuery } from './query';
import type { GetCompletionEventsByDayResponse } from './response';

export class GetCompletionEventsByDayHandler {
  constructor(private readonly getStreakRepository: GetStreakRepository) {}

  async execute(query: GetCompletionEventsByDayQuery): Promise<GetCompletionEventsByDayResponse> {
    const day = StreakDay.rehydrate(query.day).toString();
    return await this.getStreakRepository.getCompletionEventsByDay(day);
  }
}
