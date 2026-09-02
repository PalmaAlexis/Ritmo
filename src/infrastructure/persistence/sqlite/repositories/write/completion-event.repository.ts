import type { CompletionEvent } from '../../../../../domain/aggregates/completion-event/completion-event.aggregate';
import type { CompletionEventRepository } from '../../../../../domain/repositories/completion-event.repository';
import type { Database } from '../../../database';
import { SQLiteCompletionEventMapper as CompletionEventMapper } from '../../mappers/completion-event.mapper';

export class SQLiteCompletionEventRepository implements CompletionEventRepository {
  constructor(private readonly database: Database) {}

  async append(event: CompletionEvent): Promise<void> {
    const persistence = CompletionEventMapper.toPersistence(event);

    await this.database.execute(
      `INSERT INTO completion_events (
        id,
        task_id,
        completed_at,
        streak_day
      ) VALUES (?, ?, ?, ?)`,
      [persistence.id, persistence.taskId, persistence.completedAt, persistence.streakDay]
    );
  }
}
