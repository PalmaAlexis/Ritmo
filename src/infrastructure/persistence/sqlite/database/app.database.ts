import { openDatabaseSync } from 'expo-sqlite';
import { ExpoSQLiteDatabase } from './sqlite.database';
import type { Database } from '../../database';
import type { Migration } from '../migrations/migration';

const sqlite = openDatabaseSync('project-management.db');
export const database = new ExpoSQLiteDatabase(sqlite);

export class AppDatabase {
  constructor(
    private readonly database: Database,
    private readonly migrations: Migration[]
  ) {}

  async initialize(): Promise<void> {
    await this.configureDatabase();
    await this.createMigrationTable();

    for (const migration of this.migrations) {
      const executed = await this.database.get<{ version: number }>(
        `
        SELECT version
        FROM migrations
        WHERE version = ?
        `,
        [migration.version]
      );

      if (executed) continue;

      await migration.up(this.database);

      await this.database.execute(
        `
        INSERT INTO migrations(version)
        VALUES(?)
        `,
        [migration.version]
      );
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
