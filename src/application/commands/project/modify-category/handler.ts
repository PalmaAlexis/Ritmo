import { ProjectCategory } from '@/domain/aggregates/project/category.vo';
import { ProjectId } from '@/domain/aggregates/project/id.vo';
import type { ProjectRepository } from '@/domain/repositories/project.repository';
import type { ModifyProjectCategoryCommand } from './command';

export class ModifyProjectCategoryHandler {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ModifyProjectCategoryCommand): Promise<void> {
    const id = ProjectId.from(command.id);
    const category = ProjectCategory.from(command.category);

    const project = await this.projectRepository.findById(id);
    if (!project) throw new Error('Project does not exist');

    project.modifyCategory(category);
    await this.projectRepository.save(project);
  }
}
