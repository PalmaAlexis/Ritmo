import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { ReopenProjectCommand } from './command';

export class ReopenProjectHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ReopenProjectCommand): Promise<void> {
    const id = ProjectId.from(command.id);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.reopen();
    return this.projectRepository.save(project);
  }
}
