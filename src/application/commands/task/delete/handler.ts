import { TaskId } from '../../../../domain/aggregates/task/id.vo';
import type { TaskRepository } from '../../../../domain/repositories/task.repository';
import type { DeleteTaskCommand } from './command';

export class DeleteTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task does not exist');

    task.delete();
    return this.taskRepository.save(task);
  }
}
