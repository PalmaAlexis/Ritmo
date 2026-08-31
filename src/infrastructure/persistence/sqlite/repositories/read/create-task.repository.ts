import type { GetMostUsedLabelsModel } from '../../../../../application/queries/create-task/get-most-used-labels/model';
import type { CreateTaskRepository } from '../../../../../application/queries/create-task/repositories/create-task.repository';
import type { Database } from '../../../database';
import type { SQLiteMostUsedLabelRecord } from '../../records/read/create-task.record';

export class SQLiteCreateTaskRepository implements CreateTaskRepository {
  constructor(private readonly database: Database) {}

  async getMostUsedLabels(limit: number): Promise<GetMostUsedLabelsModel> {
    const normalizedLimit = Math.max(0, Math.trunc(limit));
    const labels = await this.database.all<SQLiteMostUsedLabelRecord>(
      `SELECT
          labels.id,
          labels.name,
          labels.color
        FROM labels
        LEFT JOIN task_labels
          ON task_labels.label_id = labels.id
        LEFT JOIN tasks
          ON tasks.id = task_labels.task_id
          AND tasks.deleted_at IS NULL
        WHERE labels.deleted_at IS NULL
        GROUP BY labels.id, labels.name, labels.color
        ORDER BY COUNT(tasks.id) DESC, labels.name ASC
        LIMIT ?`,
      [normalizedLimit]
    );

    return { labels };
  }
}
