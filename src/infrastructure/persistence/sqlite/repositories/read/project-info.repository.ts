import type { GetProjectBasicInfoModel } from '@/application/queries/project-info/get-basic-info/model';
import type { GetProjectDetailsModel } from '@/application/queries/project-info/get-details/model';
import type { GetProjectStatsModel } from '@/application/queries/project-info/get-stats/model';
import type { GetTasksByProjectModel } from '@/application/queries/project-info/get-tasks/model';
import type { ProjectInfoRepository } from '@/application/queries/project-info/repositories/project-info.repository';
import { TaskStatusValues } from '@/shared/task/status';
import type { Database } from '../../../database';
import type {
  SQLiteProjectBasicInfoRecord,
  SQLiteProjectDetailsRecord,
  SQLiteProjectExistsRecord,
  SQLiteProjectStatsRecord,
  SQLiteProjectTaskRecord,
} from '../../records/read/project-info.record';

export class SQLiteProjectInfoRepository implements ProjectInfoRepository {
  constructor(private readonly database: Database) {}

  async getBasicInfo(id: string): Promise<GetProjectBasicInfoModel> {
    const project = await this.database.get<SQLiteProjectBasicInfoRecord>(
      `SELECT id, title, category, status
        FROM projects
        WHERE id = ?
        AND deleted_at IS NULL
        LIMIT 1`,
      [id]
    );

    if (!project) throw new Error('Project does not exist');
    return project;
  }

  async getStats(id: string): Promise<GetProjectStatsModel> {
    await this.ensureProjectExists(id);

    const stats = await this.database.get<SQLiteProjectStatsRecord>(
      `SELECT
          COUNT(*) AS allTasksCount,
          COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS completedTasksCount,
          COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS inProgressTasksCount,
          COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS toDoTasksCount
        FROM tasks
        WHERE project_id = ?
        AND deleted_at IS NULL`,
      [TaskStatusValues.done, TaskStatusValues.inProgress, TaskStatusValues.toDo, id]
    );

    return (
      stats ?? {
        allTasksCount: 0,
        completedTasksCount: 0,
        inProgressTasksCount: 0,
        toDoTasksCount: 0,
      }
    );
  }

  async getTasks(id: string): Promise<GetTasksByProjectModel> {
    await this.ensureProjectExists(id);

    const tasks = await this.database.all<SQLiteProjectTaskRecord>(
      `SELECT
          id,
          project_id AS projectId,
          title,
          status,
          priority
        FROM tasks
        WHERE project_id = ?
        AND deleted_at IS NULL
        ORDER BY created_at DESC`,
      [id]
    );

    return { tasks };
  }

  async getDetails(id: string): Promise<GetProjectDetailsModel> {
    const record = await this.database.get<SQLiteProjectDetailsRecord>(
      `SELECT
          id,
          status,
          created_at AS createdAt,
          started_at AS startedAt,
          COALESCE(description, '') AS description,
          icon,
          color
        FROM projects
        WHERE id = ?
        AND deleted_at IS NULL
        LIMIT 1`,
      [id]
    );

    if (!record) throw new Error('Project does not exist');
    return {
      ...record,
      createdAt: new Date(record.createdAt),
      startedAt: record.startedAt ? new Date(record.startedAt) : null,
    };
  }

  private async ensureProjectExists(id: string): Promise<void> {
    const project = await this.database.get<SQLiteProjectExistsRecord>(
      `SELECT EXISTS(
          SELECT 1
          FROM projects
          WHERE id = ?
          AND deleted_at IS NULL
        ) AS exists`,
      [id]
    );

    if (project?.exists !== 1) throw new Error('Project does not exist');
  }
}
