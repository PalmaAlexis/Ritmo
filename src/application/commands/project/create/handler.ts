import { ProjectCategory } from '../../../../domain/aggregates/project/category.vo';
import { ProjectColor } from '../../../../domain/aggregates/project/color.vo';
import { ProjectDescription } from '../../../../domain/aggregates/project/description.vo';
import { ProjectIcon } from '../../../../domain/aggregates/project/icon.vo';
import { Project } from '../../../../domain/aggregates/project/project.aggregate';
import { ProjectTitle } from '../../../../domain/aggregates/project/title.vo';
import type { ProjectRepository } from '../../../../domain/repositories/project.repository';
import type { Clock } from '../../../ports/clock';
import type { CreateProjectCommand } from './command';

export class CreateProjectHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly clock: Clock
  ) {}

  async execute(command: CreateProjectCommand): Promise<void> {
    const title = ProjectTitle.from(command.title);
    const description = ProjectDescription.from(command.description);
    const category = ProjectCategory.from(command.category);
    const icon = ProjectIcon.from(command.icon);
    const color = ProjectColor.from(command.color);

    // === No duplicated projects by title ===
    const duplicated = await this.projectRepository.existsByTitle(title);
    if (duplicated) throw new Error(`Project with title: ${title.toString()}, already exists`);

    const project = Project.new(title, description, category, icon, color, this.clock.now());
    await this.projectRepository.save(project);
  }
}
