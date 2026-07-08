import type { ExpoSQLiteDatabase as Database } from '../database/sqlite.database';
import type { SQLiteMigration } from './migration';

export class SQLiteCreateTasksLabelsMigration implements SQLiteMigration {
  readonly version = 4;

  async up(database: Database): Promise<void> {
    await database.execute(`
      CREATE TABLE IF NOT EXISTS task_labels (
        task_id TEXT NOT NULL,
        label_id TEXT NOT NULL,

        PRIMARY KEY(task_id, label_id),

        FOREIGN KEY(task_id)
            REFERENCES tasks(id),

        FOREIGN KEY(label_id)
            REFERENCES labels(id)
      );
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_task_labels_task_id
      ON task_labels(task_id);
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_task_labels_label_id
      ON task_labels(label_id);
    `);
  }
}
