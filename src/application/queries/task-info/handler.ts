import type { GetTaskInfoQuery } from './query';
import type { GetTaskInfoResponse } from './response';
import type { TaskInfoRepository } from './task-info.repository';

export class GetTaskInfoHandler {
  constructor(private readonly taskInfoRepository: TaskInfoRepository) {}

  async execute(query: GetTaskInfoQuery): Promise<GetTaskInfoResponse> {
    const taskInfo = await this.taskInfoRepository.getTaskInfo(query.id);
    return {
      id: taskInfo.id,
      projectTitle: taskInfo.projectTitle,
      title: taskInfo.title,
      status: taskInfo.status,
      priority: taskInfo.priority,
      createdAt: taskInfo.createdAt,
      startedAt: taskInfo.startedAt,
      finishedAt: taskInfo.finishedAt,
      labels: taskInfo.labels,
      description: taskInfo.description,
    };
  }
}
