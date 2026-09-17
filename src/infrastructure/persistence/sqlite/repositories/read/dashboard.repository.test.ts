import { describe, expect, it, jest } from '@jest/globals';
import { ProjectColorValues } from '@/shared/project-ui/color';
import { ProjectIconValues } from '@/shared/project-ui/icon';
import { ProjectStatusValues } from '@/shared/project/status';
import { TaskPriorityValues } from '@/shared/task/priority';
import { TaskStatusValues } from '@/shared/task/status';
import type { Database } from '../../../database';
import type { SQLiteRecentTaskRecord } from '../../records/read/dashboard.record';
import { SQLiteDashboardRepository } from './dashboard.repository';

function databaseReturning(records: unknown[]) {
  const all = jest
    .fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>()
    .mockResolvedValue(records);
  const database: Database = {
    all: async <T>(sql: string, params?: unknown[]) => (await all(sql, params)) as T[],
    execute: async () => 0,
    get: async () => null,
    transaction: async (operation) => operation(database),
  };
  return { database, all };
}

describe('SQLiteDashboardRepository projections', () => {
  it('returns actionable task identities and converts persisted timestamps to application dates', async () => {
    const records: SQLiteRecentTaskRecord[] = [
      {
        id: 'task-1',
        projectId: 'project-1',
        title: 'Configurar navegación',
        projectTitle: 'Ritmo',
        startedAt: '2026-09-07T10:00:00.000Z',
        finishedAt: '2026-09-07T11:00:00.000Z',
        status: TaskStatusValues.done,
        priority: TaskPriorityValues.high,
      },
      {
        id: 'task-2',
        projectId: 'project-1',
        title: 'Crear Dashboard',
        projectTitle: 'Ritmo',
        startedAt: null,
        finishedAt: null,
        status: TaskStatusValues.toDo,
        priority: TaskPriorityValues.medium,
      },
    ];
    const { database } = databaseReturning(records);

    const result = await new SQLiteDashboardRepository(database).getRecentTasks(3);

    expect(result.tasks).toEqual([
      {
        ...records[0],
        startedAt: new Date('2026-09-07T10:00:00.000Z'),
        finishedAt: new Date('2026-09-07T11:00:00.000Z'),
      },
      records[1],
    ]);
  });

  it('filters active projects before applying the requested limit and retains customization', async () => {
    const project = {
      id: 'project-1',
      title: 'Ritmo',
      category: 'Personal',
      color: ProjectColorValues.blue,
      icon: ProjectIconValues.technology,
      status: ProjectStatusValues.inProgress,
      allTasksCount: 4,
      completedTasksCount: 3,
    };
    const { database, all } = databaseReturning([project]);

    const result = await new SQLiteDashboardRepository(database).getRecentProjects(2, true);

    expect(result.projects).toEqual([project]);
    const [sql, params] = all.mock.calls[0];
    expect(sql).toMatch(
      /WHERE projects.deleted_at IS NULL\s+AND projects.status IN \(\?, \?\)[\s\S]+LIMIT \?/
    );
    expect(params).toEqual([
      TaskStatusValues.done,
      ProjectStatusValues.toDo,
      ProjectStatusValues.inProgress,
      2,
    ]);
  });

  it('retains the unfiltered project query for existing callers', async () => {
    const { database, all } = databaseReturning([]);

    await new SQLiteDashboardRepository(database).getRecentProjects(2);

    const [sql, params] = all.mock.calls[0];
    expect(sql).not.toContain('AND projects.status IN');
    expect(params).toEqual([TaskStatusValues.done, 2]);
  });

  it('omits archived work and inactive parent projects from the next-action feed', async () => {
    const { database, all } = databaseReturning([]);

    await new SQLiteDashboardRepository(database).getRecentTasks(3);

    const [sql, params] = all.mock.calls[0];
    expect(sql).toContain('AND projects.status IN (?, ?)');
    expect(sql).toContain('AND tasks.status IN (?, ?, ?)');
    expect(params).toEqual([
      ProjectStatusValues.toDo,
      ProjectStatusValues.inProgress,
      TaskStatusValues.toDo,
      TaskStatusValues.inProgress,
      TaskStatusValues.done,
      3,
    ]);
  });
});
