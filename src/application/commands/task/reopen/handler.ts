import { TaskId } from '../../../../domain/aggregates/task/id.vo';
import type { TaskRepository } from '../../../../domain/repositories/task.repository';
import type { ReopenTaskCommand } from './command';

export class ReopenTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: ReopenTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task does not exist');

    task.reopen();
    await this.taskRepository.save(task);
  }
}
