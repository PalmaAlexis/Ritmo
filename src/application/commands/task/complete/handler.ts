import { CompletionEvent } from '@/domain/aggregates/completion-event/completion-event.aggregate';
import { TaskId } from '@/domain/aggregates/task/id.vo';
import type { Clock } from '../../../ports/clock';
import type { TaskCompletionUnitOfWork } from '../../../ports/task-completion-unit-of-work';
import type { CompleteTaskCommand } from './command';

export class CompleteTaskHandler {
  constructor(
    private readonly unitOfWork: TaskCompletionUnitOfWork,
    private readonly clock: Clock
  ) {}

  async execute(command: CompleteTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    await this.unitOfWork.execute(async ({ taskRepository, completionEventRepository }) => {
      const task = await taskRepository.findById(id);
      if (!task) throw new Error('Task does not exist');

      const completedAt = this.clock.now();
      task.complete(completedAt);

      const event = CompletionEvent.new(id, completedAt);
      await taskRepository.save(task);
      await completionEventRepository.append(event);
    });
  }
}
