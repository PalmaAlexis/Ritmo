import type { TaskId } from '../task/id.vo';
import { CompletionEventId } from './id.vo';
import { StreakDay } from './streak-day.vo';

export class CompletionEvent {
  private constructor(
    private readonly id: CompletionEventId,
    private readonly taskId: TaskId,
    private readonly completedAt: Date,
    private readonly streakDay: StreakDay
  ) {
    if (Number.isNaN(completedAt.getTime())) throw new Error('Invalid completion date');
    this.completedAt = new Date(completedAt.getTime());
  }

  // === Actions ===
  static new(taskId: TaskId, completedAt: Date): CompletionEvent {
    return new CompletionEvent(
      CompletionEventId.new(),
      taskId,
      completedAt,
      StreakDay.fromLocalDate(completedAt)
    );
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
      completedAt: new Date(this.completedAt.getTime()),
      streakDay: this.streakDay.toString(),
    };
  }
}
