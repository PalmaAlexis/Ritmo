import type { GetTaskInfoModel } from '@/application/queries/task-info/model';
import type { TaskInfoRepository } from '@/application/queries/task-info/task-info.repository';
import type { Database } from '../../../database';
import type {
  SQLiteTaskInfoLabelRecord,
  SQLiteTaskInfoRecord,
} from '../../records/read/task-info.record';

export class SQLiteTaskInfoRepository implements TaskInfoRepository {
  constructor(private readonly database: Database) {}

  async getTaskInfo(id: string): Promise<GetTaskInfoModel> {
    const task = await this.database.get<SQLiteTaskInfoRecord>(
      `SELECT
          tasks.id,
          projects.title AS projectTitle,
          tasks.title,
          tasks.status,
          tasks.priority,
          tasks.created_at AS createdAt,
          tasks.started_at AS startedAt,
          tasks.finished_at AS finishedAt,
          COALESCE(tasks.description, '') AS description
        FROM tasks
        INNER JOIN projects
          ON projects.id = tasks.project_id
          AND projects.deleted_at IS NULL
        WHERE tasks.id = ?
        AND tasks.deleted_at IS NULL
        LIMIT 1`,
      [id]
    );

    if (!task) throw new Error('Task does not exist');

    const labels = await this.database.all<SQLiteTaskInfoLabelRecord>(
      `SELECT labels.id, labels.name, labels.color
        FROM labels
        INNER JOIN task_labels ON task_labels.label_id = labels.id
        WHERE task_labels.task_id = ?
        AND labels.deleted_at IS NULL
        ORDER BY labels.name ASC`,
      [id]
    );

    return {
      ...task,
      createdAt: new Date(task.createdAt),
      startedAt: task.startedAt ? new Date(task.startedAt) : null,
      finishedAt: task.finishedAt ? new Date(task.finishedAt) : null,
      labels,
    };
  }
}
