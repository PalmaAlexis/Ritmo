import { ProjectStatusValues } from '../../../shared/project/status';

export class ProjectStatus {
  private constructor(private value: ProjectStatusValues) {}

  // === Factories ===
  static ToDo(): ProjectStatus {
    return new ProjectStatus(ProjectStatusValues.toDo);
  }
  static InProgress(): ProjectStatus {
    return new ProjectStatus(ProjectStatusValues.inProgress);
  }
  static Done(): ProjectStatus {
    return new ProjectStatus(ProjectStatusValues.done);
  }
  static Archived(): ProjectStatus {
    return new ProjectStatus(ProjectStatusValues.archived);
  }
  static Deleted(): ProjectStatus {
    return new ProjectStatus(ProjectStatusValues.deleted);
  }

  // === Queries ===
  isToDo(): boolean {
    return this.value === ProjectStatusValues.toDo;
  }
  isInProgress(): boolean {
    return this.value === ProjectStatusValues.inProgress;
  }
  isDone(): boolean {
    return this.value === ProjectStatusValues.done;
  }
  isArchived(): boolean {
    return this.value === ProjectStatusValues.archived;
  }
  isDeleted(): boolean {
    return this.value === ProjectStatusValues.deleted;
  }

  // === Utils ===
  static rehydate(value: string): ProjectStatus {
    if (!value) throw new Error(`Not valid Project status: ${value}`);

    return new ProjectStatus(value as ProjectStatusValues);
  }
  static from(value: string): ProjectStatus {
    if (!Object.values(ProjectStatusValues).includes(value as ProjectStatusValues))
      throw new Error(`Not valid Project status: ${value}`);
    return new ProjectStatus(value as ProjectStatusValues);
  }
  equals(status: ProjectStatus): boolean {
    return this.value === status.value;
  }
  toString(): ProjectStatusValues {
    return this.value;
  }
}
