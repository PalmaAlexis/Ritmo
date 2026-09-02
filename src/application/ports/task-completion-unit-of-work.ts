import type { CompletionEventRepository } from '../../domain/repositories/completion-event.repository';
import type { TaskRepository } from '../../domain/repositories/task.repository';

export interface TaskCompletionContext {
  taskRepository: TaskRepository;
  completionEventRepository: CompletionEventRepository;
}

export interface TaskCompletionUnitOfWork {
  execute(operation: (context: TaskCompletionContext) => Promise<void>): Promise<void>;
}
