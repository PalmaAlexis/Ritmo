import type { GetCompletionEventsByDayModel } from '../get-completion-events-by-day/model';
import type { GetCurrentStreakModel } from '../get-current/model';
import type { GetStreakHistoricalModel } from '../get-historical/model';
import type { GetStreakSummaryModel } from '../get-summary/model';

export interface GetStreakRepository {
  getCurrent(today: string): Promise<GetCurrentStreakModel>;
  getSummary(): Promise<GetStreakSummaryModel>;
  getHistorical(fromDay: string, toDay: string): Promise<GetStreakHistoricalModel>;
  getCompletionEventsByDay(day: string): Promise<GetCompletionEventsByDayModel>;
}
