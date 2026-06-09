export enum TaskPriorityValues {
  low = 'LOW',
  medium = 'MEDIUM',
  high = 'HIGH',
}

export class TaskPriority {
  private constructor(private value: TaskPriorityValues) {}

  // === Factories ===
  static Low(): TaskPriority {
    return new TaskPriority(TaskPriorityValues.low);
  }
  static Medium(): TaskPriority {
    return new TaskPriority(TaskPriorityValues.medium);
  }
  static High(): TaskPriority {
    return new TaskPriority(TaskPriorityValues.high);
  }

  // === Utils ===
  static rehydrate(priority: string): TaskPriority {
    if (!priority) throw new Error(`Not valid Task priority: ${priority}`);
    return new TaskPriority(priority as TaskPriorityValues);
  }
  static from(priority: string): TaskPriority {
    if (!Object.values(TaskPriorityValues).includes(priority as TaskPriorityValues))
      throw new Error(`Not valid Task priority: ${priority}`);
    return new TaskPriority(priority as TaskPriorityValues);
  }
  equals(priority: TaskPriority): boolean {
    return this.value === priority.value;
  }
  toString(): TaskPriorityValues {
    return this.value;
  }
}
