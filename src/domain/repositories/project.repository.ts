import type { ProjectId } from '../aggregates/project/id.vo';
import type { Project } from '../aggregates/project/project.aggregate';
import type { ProjectTitle } from '../aggregates/project/title.vo';

export interface ProjectRepository {
  findById(id: ProjectId): Promise<Project | null>;
  save(Project: Project): Promise<void>;
  existsByTitle(title: ProjectTitle): Promise<boolean>;
}
