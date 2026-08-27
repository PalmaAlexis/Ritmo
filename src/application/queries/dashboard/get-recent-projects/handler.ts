import type { DashboardRepository } from '../repositories/dashboard.repository';
import type { GetRecentProjectsQuery } from './query';
import type { GetRecentProjectsResponse } from './response';

export class GetRecentProjectsHandler {
  constructor(private readonly dashboardReadRepository: DashboardRepository) {}

  async execute(query: GetRecentProjectsQuery): Promise<GetRecentProjectsResponse> {
    const recentProjects = (await this.dashboardReadRepository.getRecentProjects(query.limit))
      .projects;

    return {
      projects: recentProjects.map((project) => {
        const percentage =
          project.allTasksCount === 0
            ? 0
            : (project.completedTasksCount / project.allTasksCount) * 100;
        return {
          id: project.id,
          title: project.title,
          category: project.category,
          status: project.status,
          allTasksCount: project.allTasksCount,
          completedTasksPercentage: percentage,
        };
      }),
    };
  }
}
