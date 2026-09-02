export interface SQLiteStreakDayRecord {
  day: string;
}

export interface SQLiteStreakSummaryRecord {
  activeDays: number;
  completedTasks: number;
}

export interface SQLiteStreakIntensityRecord {
  day: string;
  completedTasks: number;
}

export interface SQLiteCompletionEventByDayRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectTitle: string;
  completedAt: string;
}
