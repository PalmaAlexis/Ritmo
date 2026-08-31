import type { CompletionEvent } from '../aggregates/completion-event/completion-event.aggregate';
import type { CompletionEventId } from '../aggregates/completion-event/id.vo';

export interface CompletionEventRepository {
  findById(id: CompletionEventId): Promise<CompletionEvent | null>;
  append(event: CompletionEvent): Promise<void>;
}
