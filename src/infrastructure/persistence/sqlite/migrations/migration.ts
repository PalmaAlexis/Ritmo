import type { Database } from '../../database';

export interface SQLiteMigration {
  readonly version: number;
  up(database: Database): Promise<void>;
}
