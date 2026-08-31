import { ProjectIcon } from '../../../../domain/aggregates/project/icon.vo';
import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { ModifyProjectIconCommand } from './command';

export class ModifyProjectIconHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ModifyProjectIconCommand): Promise<void> {
    const id = ProjectId.from(command.id);
    const icon = ProjectIcon.from(command.icon);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.changeIcon(icon);
    await this.projectRepository.save(project);
  }
}
