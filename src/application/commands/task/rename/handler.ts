import { TaskId } from '../../../../domain/aggregates/task/id.vo';
import { TaskTitle } from '../../../../domain/aggregates/task/title.vo';
import type { TaskRepository } from '../../../../domain/repositories/task.repository';
import type { RenameTaskCommand } from './command';

export class RenameTaskHandler {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: RenameTaskCommand): Promise<void> {
    const id = TaskId.from(command.id);
    const title = TaskTitle.from(command.title);

    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task does not exist');

    // === Nothing to do ===
    if (task.hasTitle(title)) return;
    // === No duplicated tasks by title ===
    const duplicated = await this.taskRepository.existsByProjectAndTitle(
      task.getProjectId(),
      title
    );
    if (duplicated) throw new Error(`Task with title: ${title.toString()}, already exists`);

    task.rename(title);
    return this.taskRepository.save(task);
  }
}
