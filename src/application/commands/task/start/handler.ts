import { TaskId } from '@/domain/aggregates/task/id.vo';
import type { TaskRepository } from '@/domain/repositories/task.repository';
import type { Clock } from '../../../ports/clock';
import type { StartTaskCommand } from './command';

export class StartTaskHandler {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly clock: Clock
  ) {}

  async execute(command: StartTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task does not exist');

    task.start(this.clock.now());
    await this.taskRepository.save(task);
  }
}
