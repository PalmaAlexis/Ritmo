import type { CompletionEvent } from '../../../../domain/aggregates/completion-event/completion-event.aggregate';
import type { SQLiteCompletionEventRecord } from '../records/write/completion-event.record';

export class SQLiteCompletionEventMapper {
  static toPersistence(domain: CompletionEvent): SQLiteCompletionEventRecord {
    const primitives = domain.toPrimitives();

    return {
      id: primitives.id,
      taskId: primitives.taskId,
      completedAt: primitives.completedAt.toISOString(),
      streakDay: primitives.streakDay,
    };
  }
}
