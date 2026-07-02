import type { Database } from '../../database';
import type { Migration } from './migration';

export class CreateTasksMigration implements Migration {
  readonly version = 2;

  async up(database: Database): Promise<void> {
    await database.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        created_at TEXT NOT NULL,
        started_at TEXT,
        finished_at TEXT,
        deleted_at TEXT,
        description TEXT,

        FOREIGN KEY(project_id)
          REFERENCES projects(id)
      )
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_project_id
      ON tasks(project_id)
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status
      ON tasks(status)
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at
      ON tasks(deleted_at)
    `);
  }
}
