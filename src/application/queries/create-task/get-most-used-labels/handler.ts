import type { CreateTaskRepository } from '../repositories/create-task.repository';
import type { GetMostUsedLabelsQuery } from './query';
import type { GetMostUsedLabelsResponse } from './response';

export class GetMostUsedLabelsHandler {
  constructor(private readonly createTaskRepository: CreateTaskRepository) {}

  async execute(query: GetMostUsedLabelsQuery): Promise<GetMostUsedLabelsResponse> {
    const mostUsedLabels = (await this.createTaskRepository.getMostUsedLabels(query.limit)).labels;
    return {
      labels: mostUsedLabels.map((label) => ({
        id: label.id,
        name: label.name,
        color: label.color,
      })),
    };
  }
}
