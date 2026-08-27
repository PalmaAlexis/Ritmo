import type { GetProjectsRepository } from './get-projects.repository';
import type { GetProjectsQuery } from './query';
import type { GetProjectsResponse } from './response';

export class GetProjectsHandler {
  constructor(private readonly getProjectsRepository: GetProjectsRepository) {}

  async execute(query: GetProjectsQuery): Promise<GetProjectsResponse> {
    // === All projects if no status present ===
    const projects = (
      await this.getProjectsRepository.getProjects(query.page, query.pageSize, query.status)
    ).projects;

    return {
      projects: projects.map((project) => {
        const percentage =
          project.allTasksCount === 0
            ? 0
            : (project.completedTasksCount / project.allTasksCount) * 100;
        return {
          id: project.id,
          title: project.title,
          category: project.category,
          status: project.status,
          icon: project.icon,
          color: project.color,
          allTasksCount: project.allTasksCount,
          completedTasksCount: project.completedTasksCount,
          completedTasksPercentage: percentage,
        };
      }),
    };
  }
}
