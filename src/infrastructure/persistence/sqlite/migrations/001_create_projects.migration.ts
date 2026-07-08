import type { ExpoSQLiteDatabase as Database } from '../database/sqlite.database';
import type { SQLiteMigration } from './migration';

export class SQLiteCreateProjectsMigration implements SQLiteMigration {
  readonly version = 1;

  async up(database: Database): Promise<void> {
    await database.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        started_at TEXT,
        finished_at TEXT,
        deleted_at TEXT,
        description TEXT,
        category TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL
      )
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_projects_status
      ON projects(status);
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_projects_deleted_at
      ON projects(deleted_at);
    `);
  }
}
