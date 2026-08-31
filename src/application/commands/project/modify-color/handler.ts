import { ProjectColor } from '../../../../domain/aggregates/project/color.vo';
import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { ModifyProjectColorCommand } from './command';

export class ModifyProjectColorHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ModifyProjectColorCommand): Promise<void> {
    const id = ProjectId.from(command.id);
    const color = ProjectColor.from(command.color);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.changeColor(color);
    await this.projectRepository.save(project);
  }
}
