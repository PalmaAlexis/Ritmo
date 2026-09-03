import { ProjectId } from '@/domain/aggregates/project/id.vo';
import type { ProjectRepository } from '@/domain/repositories/project.repository';
import type { Clock } from '../../../ports/clock';
import type { CompleteProjectCommand } from './command';

export class CompleteProjectHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly clock: Clock
  ) {}

  async execute(command: CompleteProjectCommand): Promise<void> {
    const id = ProjectId.from(command.id);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.complete(this.clock.now());
    await this.projectRepository.save(project);
  }
}
