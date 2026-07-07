import { TaskStatusValues } from '../../../shared/task/status';

export class TaskStatus {
  private constructor(private value: TaskStatusValues) {}

  // === Factories ===
  static ToDo(): TaskStatus {
    return new TaskStatus(TaskStatusValues.toDo);
  }
  static InProgress(): TaskStatus {
    return new TaskStatus(TaskStatusValues.inProgress);
  }
  static Done(): TaskStatus {
    return new TaskStatus(TaskStatusValues.done);
  }
  static Archived(): TaskStatus {
    return new TaskStatus(TaskStatusValues.archived);
  }
  static Deleted(): TaskStatus {
    return new TaskStatus(TaskStatusValues.deleted);
  }

  // === Queries ===
  isToDo(): boolean {
    return this.value === TaskStatusValues.toDo;
  }
  isInProgress(): boolean {
    return this.value === TaskStatusValues.inProgress;
  }
  isDone(): boolean {
    return this.value === TaskStatusValues.done;
  }
  isArchived(): boolean {
    return this.value === TaskStatusValues.archived;
  }
  isDeleted(): boolean {
    return this.value === TaskStatusValues.deleted;
  }

  // === Utils ===
  static rehydrate(value: string): TaskStatus {
    if (!value) throw new Error(`Not valid Task status: ${value}`);

    return new TaskStatus(value as TaskStatusValues);
  }
  static from(value: string): TaskStatus {
    if (!Object.values(TaskStatusValues).includes(value as TaskStatusValues))
      throw new Error(`Not valid Task status: ${value}`);
    return new TaskStatus(value as TaskStatusValues);
  }
  equals(status: TaskStatus): boolean {
    return this.value === status.value;
  }
  toString(): TaskStatusValues {
    return this.value;
  }
}
