import type { ProjectInfoRepository } from '../repositories/project-info.repository';
import type { GetProjectBasicInfoQuery } from './query';
import type { GetProjectBasicInfoResponse } from './response';

export class GetProjectBasicInfoHandler {
  constructor(private readonly projectInfoRepository: ProjectInfoRepository) {}

  async execute(query: GetProjectBasicInfoQuery): Promise<GetProjectBasicInfoResponse> {
    const basicInfo = await this.projectInfoRepository.getBasicInfo(query.id);
    return {
      id: basicInfo.id,
      title: basicInfo.title,
      category: basicInfo.category,
      status: basicInfo.status,
    };
  }
}
