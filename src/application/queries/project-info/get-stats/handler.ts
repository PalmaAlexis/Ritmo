import type { ProjectInfoRepository } from '../repositories/project-info.repository';
import type { GetProjectStatsQuery } from './query';
import type { GetProjectStatsResponse } from './response';

export class GetProjectStatsHandler {
  constructor(private readonly projectInfoRepository: ProjectInfoRepository) {}
  async execute(query: GetProjectStatsQuery): Promise<GetProjectStatsResponse> {
    const stats = await this.projectInfoRepository.getStats(query.id);
    return {
      allTasksCount: stats.allTasksCount,
      completedTasksCount: stats.completedTasksCount,
      inProgressTasksCount: stats.inProgressTasksCount,
      toDoTasksCount: stats.toDoTasksCount,
    };
  }
}
