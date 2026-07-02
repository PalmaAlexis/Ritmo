import type { Database } from '../../database';
import type { Migration } from './migration';

export class CreateLabelsMigration implements Migration {
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
