import type { ProjectInfoRepository } from '../repositories/project-info.repository';
import type { GetProjectDetailsQuery } from './query';
import type { GetProjectDetailsResponse } from './response';

export class GetProjectDetailsHandler {
  constructor(private readonly projectInfoRepository: ProjectInfoRepository) {}

  async execute(query: GetProjectDetailsQuery): Promise<GetProjectDetailsResponse> {
    const details = await this.projectInfoRepository.getDetails(query.id);
    return {
      id: details.id,
      status: details.status,
      createdAt: details.createdAt,
      startedAt: details.startedAt,
      description: details.description,
      icon: details.icon,
      color: details.color,
    };
  }
}
