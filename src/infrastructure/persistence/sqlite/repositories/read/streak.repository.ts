import type { GetCompletionEventsByDayModel } from '../../../../../application/queries/streak/get-completion-events-by-day/model';
import type { GetCurrentStreakModel } from '../../../../../application/queries/streak/get-current/model';
import type { GetStreakHistoricalModel } from '../../../../../application/queries/streak/get-historical/model';
import type { GetStreakSummaryModel } from '../../../../../application/queries/streak/get-summary/model';
import type { GetStreakRepository } from '../../../../../application/queries/streak/repositories/get-streak.repository';
import type { Database } from '../../../database';
import type {
  SQLiteCompletionEventByDayRecord,
  SQLiteStreakDayRecord,
  SQLiteStreakIntensityRecord,
  SQLiteStreakSummaryRecord,
} from '../../records/read/streak.record';

export class SQLiteGetStreakRepository implements GetStreakRepository {
  constructor(private readonly database: Database) {}

  async getCurrent(today: string): Promise<GetCurrentStreakModel> {
    const records = await this.database.all<SQLiteStreakDayRecord>(
      `SELECT DISTINCT streak_day AS day
        FROM completion_events
        WHERE streak_day <= ?
        ORDER BY streak_day DESC`,
      [today]
    );
    const activeDays = new Set(records.map(({ day }) => day));
    const completedToday = activeDays.has(today);
    let candidate = completedToday ? today : this.previousDay(today);
    let consecutiveDays = 0;

    while (activeDays.has(candidate)) {
      consecutiveDays += 1;
      candidate = this.previousDay(candidate);
    }

    return {
      consecutiveDays,
      completedToday,
      isAtRisk: !completedToday && consecutiveDays > 0,
    };
  }

  async getSummary(): Promise<GetStreakSummaryModel> {
    const [summary, records] = await Promise.all([
      this.database.get<SQLiteStreakSummaryRecord>(
        `SELECT
            COUNT(DISTINCT streak_day) AS activeDays,
            COUNT(*) AS completedTasks
          FROM completion_events`
      ),
      this.database.all<SQLiteStreakDayRecord>(
        `SELECT DISTINCT streak_day AS day
          FROM completion_events
          ORDER BY streak_day ASC`
      ),
    ]);

    return {
      longestStreak: this.longestStreak(records.map(({ day }) => day)),
      activeDays: summary?.activeDays ?? 0,
      completedTasks: summary?.completedTasks ?? 0,
    };
  }

  async getHistorical(fromDay: string, toDay: string): Promise<GetStreakHistoricalModel> {
    const intensity = await this.database.all<SQLiteStreakIntensityRecord>(
      `SELECT
          streak_day AS day,
          COUNT(*) AS completedTasks
        FROM completion_events
        WHERE streak_day BETWEEN ? AND ?
        GROUP BY streak_day
        ORDER BY streak_day ASC`,
      [fromDay, toDay]
    );

    return { activeDays: intensity.length, intensity };
  }

  async getCompletionEventsByDay(day: string): Promise<GetCompletionEventsByDayModel> {
    const records = await this.database.all<SQLiteCompletionEventByDayRecord>(
      `SELECT
          completion_events.id,
          tasks.id AS taskId,
          tasks.title AS taskTitle,
          projects.id AS projectId,
          projects.title AS projectTitle,
          completion_events.completed_at AS completedAt
        FROM completion_events
        INNER JOIN tasks ON tasks.id = completion_events.task_id
        INNER JOIN projects ON projects.id = tasks.project_id
        WHERE completion_events.streak_day = ?
        ORDER BY completion_events.completed_at DESC`,
      [day]
    );

    return {
      day,
      events: records.map((record) => ({
        ...record,
        completedAt: new Date(record.completedAt),
      })),
    };
  }

  private longestStreak(days: string[]): number {
    let longest = 0;
    let current = 0;
    let previous: string | null = null;

    for (const day of days) {
      current = previous === null || this.previousDay(day) === previous ? current + 1 : 1;
      longest = Math.max(longest, current);
      previous = day;
    }

    return longest;
  }

  private previousDay(day: string): string {
    const [year, month, date] = day.split('-').map(Number);
    const previous = new Date(0);
    previous.setUTCHours(0, 0, 0, 0);
    previous.setUTCFullYear(year, month - 1, date);
    previous.setUTCDate(previous.getUTCDate() - 1);
    return previous.toISOString().slice(0, 10);
  }
}
