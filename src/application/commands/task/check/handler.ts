import { CompletionEvent } from '@/domain/aggregates/completion-event/completion-event.aggregate';
import { TaskId } from '@/domain/aggregates/task/id.vo';
import { TaskStatusValues } from '@/shared/task/status';
import type { Clock } from '../../../ports/clock';
import type { TaskCompletionUnitOfWork } from '../../../ports/task-completion-unit-of-work';
import type { CheckTaskCommand } from './command';

/** Completes the next action, including its required start transition, atomically. */
export class CheckTaskHandler {
  constructor(
    private readonly unitOfWork: TaskCompletionUnitOfWork,
    private readonly clock: Clock
  ) {}

  async execute(command: CheckTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    await this.unitOfWork.execute(async ({ taskRepository, completionEventRepository }) => {
      const task = await taskRepository.findById(id);
      if (!task) throw new Error('Task does not exist');

      const completedAt = this.clock.now();
      if (task.toPrimitives().status === TaskStatusValues.toDo) task.start(completedAt);
      task.complete(completedAt);

      const event = CompletionEvent.new(id, completedAt);
      await taskRepository.save(task);
      await completionEventRepository.append(event);
    });
  }
}
