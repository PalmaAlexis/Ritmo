export interface CompletionEventByDay {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectTitle: string;
  completedAt: Date;
}

export interface GetCompletionEventsByDayModel {
  day: string;
  events: CompletionEventByDay[];
}
