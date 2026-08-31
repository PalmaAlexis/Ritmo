import type { ProjectId } from '../../../../../domain/aggregates/project/id.vo';
import type { TaskId } from '../../../../../domain/aggregates/task/id.vo';
import type { Task } from '../../../../../domain/aggregates/task/task.aggregate';
import type { TaskTitle } from '../../../../../domain/aggregates/task/title.vo';
import type { TaskRepository } from '../../../../../domain/repositories/task.repository';
import type { Database } from '../../../database';
import { SQLiteTaskLabelMapper as TaskLabelMapper } from '../../mappers/task-label.mapper';
import { SQLiteTaskMapper as TaskMapper } from '../../mappers/task.mapper';
import type { SQLiteExistsRecord, SQLiteTaskCountRecord } from '../../records/write/query.record';
import type { SQLiteTaskLabelRecord } from '../../records/write/task-label.record';
import type { SQLiteTaskRecord } from '../../records/write/task.record';

export class SQLiteTaskRepository implements TaskRepository {
  constructor(private readonly database: Database) {}

  async findById(id: TaskId): Promise<Task | null> {
    const recordTask = await this.database.get<SQLiteTaskRecord>(
      `SELECT
          tasks.id,
          tasks.project_id AS projectId,
          tasks.title,
          tasks.status,
          tasks.priority,
          tasks.created_at AS createdAt,
          tasks.started_at AS startedAt,
          tasks.finished_at AS finishedAt,
          tasks.deleted_at AS deletedAt,
          tasks.description
        FROM tasks
        INNER JOIN projects
          ON projects.id = tasks.project_id
          AND projects.deleted_at IS NULL
        WHERE tasks.id = ?
        AND tasks.deleted_at IS NULL
        LIMIT 1`,
      [id.toString()]
    );
    if (!recordTask) return null;

    const recordLabels = await this.database.all<SQLiteTaskLabelRecord>(
      `SELECT
          task_labels.task_id AS taskId,
          task_labels.label_id AS labelId
        FROM task_labels
        INNER JOIN labels
          ON labels.id = task_labels.label_id
          AND labels.deleted_at IS NULL
        WHERE task_labels.task_id = ?`,
      [id.toString()]
    );
    const labels = TaskLabelMapper.toDomain(recordLabels);
    return TaskMapper.toDomain(recordTask, labels);
  }

  private async saveTask(database: Database, persistence: SQLiteTaskRecord): Promise<void> {
    await database.execute(
      `
      INSERT INTO tasks 
      (
          id,
          project_id,
          title,
          status,
          priority,
          created_at,
          started_at,
          finished_at,
          deleted_at,
          description
      ) 
      VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id)
      DO UPDATE SET
        project_id = excluded.project_id,
        title = excluded.title,
        status = excluded.status,
        priority = excluded.priority,
        created_at = excluded.created_at,
        started_at = excluded.started_at,
        finished_at = excluded.finished_at,
        deleted_at = excluded.deleted_at,
        description = excluded.description;
    `,
      [
        persistence.id,
        persistence.projectId,
        persistence.title,
        persistence.status,
        persistence.priority,
        persistence.createdAt,
        persistence.startedAt,
        persistence.finishedAt,
        persistence.deletedAt,
        persistence.description,
      ]
    );
  }

  private async deleteTaskLabels(database: Database, taskId: TaskId): Promise<void> {
    await database.execute(
      `DELETE FROM task_labels 
      WHERE task_id = ?;
    `,
      [taskId.toString()]
    );
  }

  private async saveTaskLabels(database: Database, labels: SQLiteTaskLabelRecord[]): Promise<void> {
    if (labels.length === 0) return;

    const insertValues = labels.map(() => '(?, ?)').join(', ');
    const flatArgs = labels.flatMap((label) => [label.taskId, label.labelId]);
    await database.execute(
      `
      INSERT INTO task_labels(task_id, label_id) 
      VALUES ${insertValues};
    `,
      flatArgs
    );
  }

  async save(task: Task): Promise<void> {
    await this.database.transaction(async (database) => {
      const taskPersistence = TaskMapper.toPersistence(task);
      const labelPersistence = TaskLabelMapper.toPersistence(task.getId(), task.getLabelsIds());
      await this.saveTask(database, taskPersistence);
      // === Delete all in case some labels are removed, then create them again ===
      await this.deleteTaskLabels(database, task.getId());
      await this.saveTaskLabels(database, labelPersistence);
    });
  }

  async existsByProjectAndTitle(projectId: ProjectId, title: TaskTitle): Promise<boolean> {
    const record = await this.database.get<SQLiteExistsRecord>(
      `SELECT EXISTS(
        SELECT 1 
        FROM tasks
        WHERE project_id = ? AND
        title = ?
        AND deleted_at IS NULL) 
      AS exists`,
      [projectId.toString(), title.toString()]
    );
    return record?.exists === 1;
  }

  async countTasksByProject(projectId: ProjectId): Promise<number> {
    const record = await this.database.get<SQLiteTaskCountRecord>(
      `SELECT 
            COUNT(*) AS taskCount
        FROM 
            tasks
        WHERE project_id = ?
        AND deleted_at IS NULL;`,
      [projectId.toString()]
    );
    return record?.taskCount ?? 0;
  }
}
