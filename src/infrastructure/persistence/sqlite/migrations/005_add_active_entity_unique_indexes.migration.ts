import type { Database } from '../../database';
import type { SQLiteMigration } from './migration';

export class SQLiteAddActiveEntityUniqueIndexesMigration implements SQLiteMigration {
  readonly version = 5;

  async up(database: Database): Promise<void> {
    await database.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_active_title_unique
      ON projects(title)
      WHERE deleted_at IS NULL;
    `);

    await database.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_labels_active_name_unique
      ON labels(name)
      WHERE deleted_at IS NULL;
    `);

    await database.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_active_project_title_unique
      ON tasks(project_id, title)
      WHERE deleted_at IS NULL;
    `);
  }
}
