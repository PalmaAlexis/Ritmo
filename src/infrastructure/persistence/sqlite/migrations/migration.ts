import type { Database } from '../../database';

export interface Migration {
  readonly version: number;
  up(database: Database): Promise<void>;
}
