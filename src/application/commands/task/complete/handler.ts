import { TaskId } from '../../../../domain/aggregates/task/id.vo';
import type { TaskRepository } from '../../../../domain/repositories/task.repository';
import type { CompleteTaskCommand } from './command';

export class CompleteTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: CompleteTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task does not exist');

    task.complete();
    return this.taskRepository.save(task);
  }
}
