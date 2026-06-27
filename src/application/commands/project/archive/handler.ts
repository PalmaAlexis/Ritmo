import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { ArchiveProjectCommand } from './command';

export class ArchiveProjectHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ArchiveProjectCommand): Promise<void> {
    const id = ProjectId.from(command.id);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.archive();
    return this.projectRepository.save(project);
  }
}
