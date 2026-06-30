import { openDatabaseSync } from 'expo-sqlite';
import { ExpoSQLiteDatabase } from './sqlite.database';

const sqlite = openDatabaseSync('project-management.db');
export const database = new ExpoSQLiteDatabase(sqlite);
