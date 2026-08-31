import type { TaskId } from '../task/id.vo';
import { CompletionEventId } from './id.vo';

export class CompletionEvent {
  private constructor(
    private readonly id: CompletionEventId,
    private taskId: TaskId,
    private completedAt: Date, // Instant
    private activityDay: Date // Day [streak]
  ) {}

  // === Actions ===
  static new(taskId: TaskId, completedAt: Date, activityDay: Date): CompletionEvent {
    return new CompletionEvent(CompletionEventId.new(), taskId, completedAt, activityDay);
  }

  // === Utils ===
  static rehydrate(
    id: CompletionEventId,
    taskId: TaskId,
    completedAt: Date,
    activityDay: Date
  ): CompletionEvent {
    return new CompletionEvent(id, taskId, completedAt, activityDay);
  }
  toPrimitives() {
    return {
      id: this.id.toString(),
      taskId: this.taskId.toString(),
      completedAt: this.completedAt,
      activityDay: this.activityDay,
    };
  }
}
