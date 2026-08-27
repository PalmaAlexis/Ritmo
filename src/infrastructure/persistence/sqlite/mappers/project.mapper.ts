import { ProjectCategory } from '../../../../domain/aggregates/project/category.vo';
import { ProjectColor } from '../../../../domain/aggregates/project/color.vo';
import { ProjectDescription } from '../../../../domain/aggregates/project/description.vo';
import { ProjectIcon } from '../../../../domain/aggregates/project/icon.vo';
import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import { ProjectStatus } from '../../../../domain/aggregates/project/status.vo';
import { ProjectTitle } from '../../../../domain/aggregates/project/title.vo';
import { Project } from '../../../../domain/aggregates/project/project.aggregate';
import type { SQLiteProjectRecord } from '../records/project.record';

export class SQLiteProjectMapper {
  static toDomain(persistence: SQLiteProjectRecord): Project {
    return Project.rehydrate(
      ProjectId.rehydrate(persistence.id),
      ProjectTitle.rehydrate(persistence.title),
      ProjectStatus.rehydrate(persistence.status),
      new Date(persistence.createdAt),
      persistence.startedAt ? new Date(persistence.startedAt) : null,
      persistence.finishedAt ? new Date(persistence.finishedAt) : null,
      persistence.deletedAt ? new Date(persistence.deletedAt) : null,
      persistence.description ? ProjectDescription.rehydrate(persistence.description) : null,
      ProjectCategory.rehydrate(persistence.category),
      ProjectIcon.rehydrate(persistence.icon),
      ProjectColor.rehydrate(persistence.color)
    );
  }

  static toPersistence(domain: Project): SQLiteProjectRecord {
    const primitives = domain.toPrimitives();
    return {
      id: primitives.id,
      title: primitives.title,
      status: primitives.status,
      createdAt: primitives.createdAt.toISOString(),
      startedAt: primitives.startedAt?.toISOString() ?? null,
      finishedAt: primitives.finishedAt?.toISOString() ?? null,
      deletedAt: primitives.deletedAt?.toISOString() ?? null,
      description: primitives.description,
      category: primitives.category,
      icon: primitives.icon,
      color: primitives.color,
    };
  }
}
