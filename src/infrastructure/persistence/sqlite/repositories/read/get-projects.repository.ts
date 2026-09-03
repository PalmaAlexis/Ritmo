import type { GetProjectsModel } from '@/application/queries/get-projects/model';
import type { GetProjectsRepository } from '@/application/queries/get-projects/get-projects.repository';
import type { ProjectStatusValues } from '@/shared/project/status';
import { TaskStatusValues } from '@/shared/task/status';
import type { Database } from '../../../database';
import type { SQLiteProjectListItemRecord } from '../../records/read/get-projects.record';

export class SQLiteGetProjectsRepository implements GetProjectsRepository {
  constructor(private readonly database: Database) {}

  async getProjects(
    page: number,
    pageSize: number,
    status: ProjectStatusValues | null
  ): Promise<GetProjectsModel> {
    const normalizedPage = Math.max(1, Math.trunc(page));
    const normalizedPageSize = Math.max(0, Math.trunc(pageSize));
    const params: unknown[] = [TaskStatusValues.done];
    const statusFilter = status ? 'AND projects.status = ?' : '';
    if (status) params.push(status);
    params.push(normalizedPageSize, (normalizedPage - 1) * normalizedPageSize);

    const projects = await this.database.all<SQLiteProjectListItemRecord>(
      `SELECT
          projects.id,
          projects.title,
          projects.category,
          projects.status,
          projects.icon,
          projects.color,
          COUNT(tasks.id) AS allTasksCount,
          COALESCE(SUM(CASE WHEN tasks.status = ? THEN 1 ELSE 0 END), 0) AS completedTasksCount
        FROM projects
        LEFT JOIN tasks
          ON tasks.project_id = projects.id
          AND tasks.deleted_at IS NULL
        WHERE projects.deleted_at IS NULL
        ${statusFilter}
        GROUP BY projects.id
        ORDER BY projects.created_at DESC
        LIMIT ? OFFSET ?`,
      params
    );

    return { projects };
  }
}
