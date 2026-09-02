export interface StreakIntensity {
  day: string;
  completedTasks: number;
}

export interface GetStreakHistoricalModel {
  activeDays: number;
  intensity: StreakIntensity[];
}
