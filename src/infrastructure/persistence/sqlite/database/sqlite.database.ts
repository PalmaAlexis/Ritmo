import type { SQLiteBindParams, SQLiteDatabase } from 'expo-sqlite';
import type { Database } from '../../database';

export class ExpoSQLiteDatabase implements Database {
  constructor(private readonly database: SQLiteDatabase) {}

  async execute(sql: string, params: unknown[] = []): Promise<number> {
    const result = await this.database.runAsync(sql, params as SQLiteBindParams);
    return result.changes;
  }

  async get<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const result = await this.database.getFirstAsync<T>(sql, params as SQLiteBindParams);

    return result ?? null;
  }

  async all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return await this.database.getAllAsync<T>(sql, params as SQLiteBindParams);
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.database.execAsync('BEGIN');

    try {
      const result = await callback();
      await this.database.execAsync('COMMIT');
      return result;
    } catch (error) {
      await this.database.execAsync('ROLLBACK');
      throw error;
    }
  }
}
