import { TaskId } from '../../../../domain/aggregates/task/id.vo';
import type { TaskRepository } from '../../../../domain/repositories/task.repository';
import type { Clock } from '../../../ports/clock';
import type { CompleteTaskCommand } from './command';

export class CompleteTaskHandler {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly clock: Clock
  ) {}

  async execute(command: CompleteTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task does not exist');

    task.complete(this.clock.now());
    await this.taskRepository.save(task);
  }
}
