import type { GetRecentProjectsModel } from '@/application/queries/dashboard/get-recent-projects/model';
import type { GetRecentTasksModel } from '@/application/queries/dashboard/get-recent-tasks/model';
import type { GetDashboardSummaryModel } from '@/application/queries/dashboard/get-summary/model';
import type { GetWeeklyCountModel } from '@/application/queries/dashboard/get-weekly-count/model';
import type { DashboardRepository } from '@/application/queries/dashboard/repositories/dashboard.repository';
import { ProjectStatusValues } from '@/shared/project/status';
import { TaskStatusValues } from '@/shared/task/status';
import type { Database } from '../../../database';
import type {
  SQLiteDashboardProjectSummaryRecord,
  SQLiteDashboardTaskSummaryRecord,
  SQLiteRecentProjectRecord,
  SQLiteRecentTaskRecord,
  SQLiteWeeklyTaskCountRecord,
} from '../../records/read/dashboard.record';

export class SQLiteDashboardRepository implements DashboardRepository {
  constructor(private readonly database: Database) {}

  async getSummary(): Promise<GetDashboardSummaryModel> {
    const projects = await this.database.get<SQLiteDashboardProjectSummaryRecord>(
      `SELECT
          COALESCE(SUM(CASE WHEN status IN (?, ?) THEN 1 ELSE 0 END), 0) AS activeProjects,
          COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS completedProjects
        FROM projects
        WHERE deleted_at IS NULL`,
      [ProjectStatusValues.toDo, ProjectStatusValues.inProgress, ProjectStatusValues.done]
    );
    const tasks = await this.database.get<SQLiteDashboardTaskSummaryRecord>(
      `SELECT
          COALESCE(SUM(CASE WHEN status IN (?, ?) THEN 1 ELSE 0 END), 0) AS activeTasks,
          COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) AS completedTasks
        FROM tasks
        WHERE deleted_at IS NULL`,
      [TaskStatusValues.toDo, TaskStatusValues.inProgress, TaskStatusValues.done]
    );

    return {
      activeProjects: projects?.activeProjects ?? 0,
      completedProjects: projects?.completedProjects ?? 0,
      activeTasks: tasks?.activeTasks ?? 0,
      completedTasks: tasks?.completedTasks ?? 0,
    };
  }

  async getWeeklyCount(): Promise<GetWeeklyCountModel> {
    const count = await this.database.get<SQLiteWeeklyTaskCountRecord>(
      `SELECT
          COALESCE(SUM(CASE WHEN strftime('%w', finished_at, 'localtime') = '1' THEN 1 ELSE 0 END), 0) AS monday,
          COALESCE(SUM(CASE WHEN strftime('%w', finished_at, 'localtime') = '2' THEN 1 ELSE 0 END), 0) AS tuesday,
          COALESCE(SUM(CASE WHEN strftime('%w', finished_at, 'localtime') = '3' THEN 1 ELSE 0 END), 0) AS wednesday,
          COALESCE(SUM(CASE WHEN strftime('%w', finished_at, 'localtime') = '4' THEN 1 ELSE 0 END), 0) AS thursday,
          COALESCE(SUM(CASE WHEN strftime('%w', finished_at, 'localtime') = '5' THEN 1 ELSE 0 END), 0) AS friday,
          COALESCE(SUM(CASE WHEN strftime('%w', finished_at, 'localtime') = '6' THEN 1 ELSE 0 END), 0) AS saturday,
          COALESCE(SUM(CASE WHEN strftime('%w', finished_at, 'localtime') = '0' THEN 1 ELSE 0 END), 0) AS sunday
        FROM tasks
        WHERE status = ?
        AND deleted_at IS NULL
        AND date(finished_at, 'localtime') >= date('now', 'localtime', 'weekday 0', '-6 days')
        AND date(finished_at, 'localtime') < date('now', 'localtime', 'weekday 0', '+1 day')`,
      [TaskStatusValues.done]
    );

    return {
      tasks: count ?? {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      },
    };
  }

  async getRecentProjects(limit: number): Promise<GetRecentProjectsModel> {
    const records = await this.database.all<SQLiteRecentProjectRecord>(
      `SELECT
          projects.id,
          projects.title,
          projects.category,
          projects.status,
          COUNT(tasks.id) AS allTasksCount,
          COALESCE(SUM(CASE WHEN tasks.status = ? THEN 1 ELSE 0 END), 0) AS completedTasksCount
        FROM projects
        LEFT JOIN tasks
          ON tasks.project_id = projects.id
          AND tasks.deleted_at IS NULL
        WHERE projects.deleted_at IS NULL
        GROUP BY projects.id
        ORDER BY projects.created_at DESC
        LIMIT ?`,
      [TaskStatusValues.done, Math.max(0, Math.trunc(limit))]
    );

    return { projects: records };
  }

  async getRecentTasks(limit: number): Promise<GetRecentTasksModel> {
    const records = await this.database.all<SQLiteRecentTaskRecord>(
      `SELECT
          tasks.title,
          projects.title AS projectTitle,
          tasks.started_at AS startedAt,
          tasks.priority,
          tasks.status
        FROM tasks
        INNER JOIN projects
          ON projects.id = tasks.project_id
          AND projects.deleted_at IS NULL
        WHERE tasks.deleted_at IS NULL
        ORDER BY tasks.created_at DESC
        LIMIT ?`,
      [Math.max(0, Math.trunc(limit))]
    );

    return {
      tasks: records.map((record) => ({
        ...record,
        startedAt: record.startedAt ? new Date(record.startedAt) : null,
      })),
    };
  }
}
