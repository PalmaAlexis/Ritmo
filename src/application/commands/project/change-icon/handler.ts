import { ProjectIcon } from '../../../../domain/aggregates/project/icon.vo';
import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { ChangeProjectIconCommand } from './command';

export class ChangeProjecIconHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ChangeProjectIconCommand): Promise<void> {
    const id = ProjectId.from(command.id);
    const icon = ProjectIcon.from(command.icon);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.changeIcon(icon);
    return this.projectRepository.save(project);
  }
}
