export interface WeeklyCount {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface GetWeeklyCountModel {
  tasks: WeeklyCount;
}
