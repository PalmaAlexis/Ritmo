import type { ProjectId } from '../aggregates/project/id.vo';
import type { TaskId } from '../aggregates/task/id.vo';
import type { Task } from '../aggregates/task/task.aggregate';
import type { TaskTitle } from '../aggregates/task/title.vo';

export interface TaskRepository {
  findById(id: TaskId): Promise<Task | null>;
  save(task: Task): Promise<void>;
  existsByProjectAndTitle(projectId: ProjectId, title: TaskTitle): Promise<boolean>;
  countTasksByProject(projectId: ProjectId): Promise<number>;
}
