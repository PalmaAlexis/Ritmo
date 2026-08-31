import { openDatabaseSync } from 'expo-sqlite';
import type { Database } from '../../database';
import { ExpoSQLiteDatabase } from './sqlite.database';
import { SQLiteCreateProjectsMigration } from '../migrations/001_create_projects.migration';
import { SQLiteCreateTasksMigration } from '../migrations/002_create_tasks.migration';
import { SQLiteCreateLabelsMigration } from '../migrations/003_create_labels.migration';
import { SQLiteCreateTasksLabelsMigration } from '../migrations/004_create_task_labels_migration';
import { SQLiteAddActiveEntityUniqueIndexesMigration } from '../migrations/005_add_active_entity_unique_indexes.migration';
import type { SQLiteMigration } from '../migrations/migration';

const sqlite = openDatabaseSync('project-management.db');
export const database = new ExpoSQLiteDatabase(sqlite);

export class SQLiteAppDatabase {
  constructor(
    private readonly database: Database,
    private readonly migrations: SQLiteMigration[]
  ) {}

  async initialize(): Promise<void> {
    await this.configureDatabase();
    await this.createMigrationTable();

    const orderedMigrations = [...this.migrations].sort(
      (first, second) => first.version - second.version
    );

    for (const migration of orderedMigrations) {
      const executed = await this.database.get<{ version: number }>(
        `
        SELECT version
        FROM migrations
        WHERE version = ?
        `,
        [migration.version]
      );

      if (executed) continue;

      await this.database.transaction(async (database) => {
        await migration.up(database);

        await database.execute(
          `
          INSERT INTO migrations(version)
          VALUES(?)
          `,
          [migration.version]
        );
      });
    }
  }

  private async createMigrationTable(): Promise<void> {
    await this.database.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY NOT NULL
      )
    `);
  }

  private async configureDatabase(): Promise<void> {
    await this.database.execute(`
        PRAGMA foreign_keys = ON
    `);

    await this.database.execute(`
        PRAGMA journal_mode = WAL
    `);
  }
}

export const appDatabase = new SQLiteAppDatabase(database, [
  new SQLiteCreateProjectsMigration(),
  new SQLiteCreateTasksMigration(),
  new SQLiteCreateLabelsMigration(),
  new SQLiteCreateTasksLabelsMigration(),
  new SQLiteAddActiveEntityUniqueIndexesMigration(),
]);
