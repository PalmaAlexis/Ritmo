import type {
  TaskCompletionContext,
  TaskCompletionUnitOfWork,
} from '@/application/ports/task-completion-unit-of-work';
import type { Database } from '../../database';
import { SQLiteCompletionEventRepository } from '../repositories/write/completion-event.repository';
import { SQLiteTaskRepository } from '../repositories/write/task.repository';

export class SQLiteTaskCompletionUnitOfWork implements TaskCompletionUnitOfWork {
  constructor(private readonly database: Database) {}

  async execute(operation: (context: TaskCompletionContext) => Promise<void>): Promise<void> {
    await this.database.transaction(async (transaction) => {
      const context: TaskCompletionContext = {
        taskRepository: new SQLiteTaskRepository(transaction),
        completionEventRepository: new SQLiteCompletionEventRepository(transaction),
      };

      await operation(context);
    });
  }
}
