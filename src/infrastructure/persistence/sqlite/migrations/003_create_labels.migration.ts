import type { ExpoSQLiteDatabase as Database } from '../database/sqlite.database';
import type { SQLiteMigration } from './migration';

export class SQLiteCreateLabelsMigration implements SQLiteMigration {
  readonly version = 3;

  async up(database: Database): Promise<void> {
    await database.execute(`
      CREATE TABLE IF NOT EXISTS labels (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        deleted_at TEXT
      )
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_labels_deleted_at
      ON labels(deleted_at);
    `);
  }
}
