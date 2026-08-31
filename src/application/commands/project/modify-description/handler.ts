import { ProjectDescription } from '../../../../domain/aggregates/project/description.vo';
import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { ModifyProjectDescriptionCommand } from './command';

export class ModifyProjectDescriptionHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ModifyProjectDescriptionCommand): Promise<void> {
    const id = ProjectId.from(command.id);
    const description = ProjectDescription.from(command.description);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.modifyDescription(description);
    await this.projectRepository.save(project);
  }
}
