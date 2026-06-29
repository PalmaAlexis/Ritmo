import { TaskStatusValues } from '../../../../shared/task/status';
import type { ProjectInfoRepository } from '../repositories/project-info.repository';
import type { TasksInfoByProject } from './model';
import type { GetTasksByProjectQuery } from './query';
import type { GetTasksByProjectResponse } from './response';

export class GetTasksByProjectHandler {
  constructor(private readonly projectInfoRepository: ProjectInfoRepository) {}

  async execute(query: GetTasksByProjectQuery): Promise<GetTasksByProjectResponse> {
    const tasks = (await this.projectInfoRepository.getTasks(query.projectId)).tasks;
    const tasksToDoCount = this.getCountByStatus(tasks, TaskStatusValues.toDo);
    const tasksInProgressCount = this.getCountByStatus(tasks, TaskStatusValues.inProgress);
    const tasksDoneCount = this.getCountByStatus(tasks, TaskStatusValues.done);

    return {
      tasksTotalCount: tasks.length,
      tasksToDoCount,
      tasksInProgressCount,
      tasksDoneCount,
      tasks,
    };
  }

  private getCountByStatus(tasks: TasksInfoByProject[], status: TaskStatusValues): number {
    return tasks.filter((task) => task.status === status).length;
  }
}
