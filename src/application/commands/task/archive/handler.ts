import { TaskId } from '../../../../domain/aggregates/task/id.vo';
import type { TaskRepository } from '../../../../domain/repositories/task.repository';
import type { ArchiveTaskCommand } from './command';

export class ArchiveTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: ArchiveTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task does not exist');

    task.archive();
    await this.taskRepository.save(task);
  }
}
