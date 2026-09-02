import type { CompletionEvent } from '../aggregates/completion-event/completion-event.aggregate';

export interface CompletionEventRepository {
  append(event: CompletionEvent): Promise<void>;
}
