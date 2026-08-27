import { LabelId } from '../../../../domain/aggregates/label/id.vo';
import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import { TaskDescription } from '../../../../domain/aggregates/task/description.vo';
import { TaskPriority } from '../../../../domain/aggregates/task/priority.vo';
import { Task } from '../../../../domain/aggregates/task/task.aggregate';
import { TaskTitle } from '../../../../domain/aggregates/task/title.vo';
import type { LabelRepository } from '../../../../domain/repositories/label.repository';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { TaskRepository } from '../../../../domain/repositories/task.repository';
import type { CreateTaskCommand } from './command';

export class CreateTaskHandler {
  private static MAX_TASKS_BY_PROJECT = 20;
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly labelRepository: LabelRepository
  ) {}

  async execute(command: CreateTaskCommand): Promise<void> {
    const projectId = ProjectId.from(command.projectId);
    const title = TaskTitle.from(command.title);
    const priority = TaskPriority.from(command.priority);
    const labelsIds: LabelId[] = command.labelsIds.map(LabelId.from);
    const description = TaskDescription.from(command.description);

    // === Existing project ===
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new Error('Project does not exist');

    // == Max N tasks per project ===
    const tasksCount = await this.taskRepository.countTasksByProject(projectId);
    if (CreateTaskHandler.MAX_TASKS_BY_PROJECT <= tasksCount)
      throw new Error(
        `Project cannot have more than ${CreateTaskHandler.MAX_TASKS_BY_PROJECT} tasks`
      );

    // === No duplicated tasks by title in same project ===
    const duplicated = await this.taskRepository.existsByProjectAndTitle(projectId, title);
    if (duplicated) throw new Error(`Task with title: ${title.toString()}, already exists`);

    // === Existing labels ===
    const validLabels = await this.labelRepository.existsAll(labelsIds);
    if (!validLabels) throw new Error('Some labels do not exist');

    const task = Task.new(projectId, title, priority, labelsIds, description);
    return this.taskRepository.save(task);
  }
}
