import type { Database } from '../../database';
import type { SQLiteMigration } from './migration';

export class SQLiteCreateCompletionEventsMigration implements SQLiteMigration {
  readonly version = 6;

  async up(database: Database): Promise<void> {
    await database.execute(`
      CREATE TABLE IF NOT EXISTS completion_events (
        id TEXT PRIMARY KEY NOT NULL,
        task_id TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        streak_day TEXT NOT NULL,

        FOREIGN KEY(task_id)
          REFERENCES tasks(id)
      );
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_completion_events_streak_day
      ON completion_events(streak_day);
    `);

    await database.execute(`
      CREATE INDEX IF NOT EXISTS idx_completion_events_task_completed_at
      ON completion_events(task_id, completed_at);
    `);
  }
}
