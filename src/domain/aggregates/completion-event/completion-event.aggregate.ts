import type { TaskId } from '../task/id.vo';
import type { StreakDay } from './streak-day.vo';
import { CompletionEventId } from './id.vo';

export class CompletionEvent {
  private constructor(
    private readonly id: CompletionEventId,
    private taskId: TaskId,
    private completedAt: Date, // === Tracking ===
    private streakDay: StreakDay
  ) {}

  // === Actions ===
  static new(taskId: TaskId, completedAt: Date, streakDay: StreakDay): CompletionEvent {
    return new CompletionEvent(CompletionEventId.new(), taskId, completedAt, streakDay);
  }

  // === Utils ===
  static rehydrate(
    id: CompletionEventId,
    taskId: TaskId,
    completedAt: Date,
    streakDay: StreakDay
  ): CompletionEvent {
    return new CompletionEvent(id, taskId, completedAt, streakDay);
  }
  toPrimitives() {
    return {
      id: this.id.toString(),
      taskId: this.taskId.toString(),
      completedAt: this.completedAt,
      streakDay: this.streakDay,
    };
  }
}
