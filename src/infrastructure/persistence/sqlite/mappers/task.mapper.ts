import type { LabelId } from '../../../../domain/aggregates/label/id.vo';
import type { SQLiteTaskRecord } from '../records/write/task.record';
import { ProjectId } from '../../../../domain/aggregates/project/id.vo';
import { TaskDescription } from '../../../../domain/aggregates/task/description.vo';
import { TaskId } from '../../../../domain/aggregates/task/id.vo';
import { TaskPriority } from '../../../../domain/aggregates/task/priority.vo';
import { TaskStatus } from '../../../../domain/aggregates/task/status.vo';
import { Task } from '../../../../domain/aggregates/task/task.aggregate';
import { TaskTitle } from '../../../../domain/aggregates/task/title.vo';

export class SQLiteTaskMapper {
  static toDomain(persistence: SQLiteTaskRecord, labelId: LabelId[]): Task {
    return Task.rehydrate(
      TaskId.rehydrate(persistence.id),
      ProjectId.rehydrate(persistence.projectId),
      TaskTitle.rehydrate(persistence.title),
      TaskStatus.rehydrate(persistence.status),
      TaskPriority.rehydrate(persistence.priority),
      new Date(persistence.createdAt),
      persistence.startedAt ? new Date(persistence.startedAt) : null,
      persistence.finishedAt ? new Date(persistence.finishedAt) : null,
      persistence.deletedAt ? new Date(persistence.deletedAt) : null,
      labelId,
      persistence.description ? TaskDescription.rehydrate(persistence.description) : null
    );
  }

  static toPersistence(domain: Task): SQLiteTaskRecord {
    const primitives = domain.toPrimitives();
    return {
      id: primitives.id,
      projectId: primitives.projectId,
      title: primitives.title,
      status: primitives.status,
      priority: primitives.priority,
      createdAt: primitives.createdAt.toISOString(),
      startedAt: primitives.startedAt?.toISOString() ?? null,
      finishedAt: primitives.finishedAt?.toISOString() ?? null,
      deletedAt: primitives.deletedAt?.toISOString() ?? null,
      description: primitives.description,
    };
  }
}
