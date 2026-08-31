import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import { ProjectTitle } from '../../../../domain/aggregates/project/title.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { RenameProjectCommand } from './command';

export class RenameProjectHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: RenameProjectCommand): Promise<void> {
    const id = ProjectId.from(command.id);
    const title = ProjectTitle.from(command.title);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    if (!project.hasTitle(title)) {
      // === No duplicated projects by title ===
      const duplicated = await this.projectRepository.existsByTitle(title);
      if (duplicated) throw new Error(`Project with title: ${title.toString()}, already exists`);

      project.rename(title);
      await this.projectRepository.save(project);
    }
  }
}
