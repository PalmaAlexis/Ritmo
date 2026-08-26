import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { StartProjectCommand } from './command';

export class CreateProjectHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: StartProjectCommand): Promise<void> {
    const id = ProjectId.from(command.id);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.start();
    return this.projectRepository.save(project);
  }
}
