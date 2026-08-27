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

  async transaction<T>(callback: (database: Database) => Promise<T>): Promise<T> {
    let result!: T;

    await this.database.withExclusiveTransactionAsync(async (transaction) => {
      const transactionDatabase = new ExpoSQLiteDatabase(transaction);
      result = await callback(transactionDatabase);
    });

    return result;
  }
}
