import { StreakDay } from '../../../../domain/aggregates/completion-event/streak-day.vo';
import type { Clock } from '../../../ports/clock';
import type { GetStreakRepository } from '../repositories/get-streak.repository';
import type { GetCurrentStreakQuery } from './query';
import type { GetCurrentStreakResponse } from './response';

export class GetCurrentStreakHandler {
  constructor(
    private readonly getStreakRepository: GetStreakRepository,
    private readonly clock: Clock
  ) {}

  async execute(_query: GetCurrentStreakQuery): Promise<GetCurrentStreakResponse> {
    const today = StreakDay.fromLocalDate(this.clock.now());
    return await this.getStreakRepository.getCurrent(today.toString());
  }
}
