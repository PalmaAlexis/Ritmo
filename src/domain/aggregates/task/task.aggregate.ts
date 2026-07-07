import type { LabelId } from '../label/id.vo';
import type { ProjectId } from '../project/id.vo';
import type { TaskDescription } from './description.vo';
import type { TaskPriority } from './priority.vo';
import type { TaskTitle } from './title.vo';
import { TaskId } from './id.vo';
import { TaskStatus } from './status.vo';

export class Task {
  private constructor(
    private readonly id: TaskId,
    private projectId: ProjectId,
    private title: TaskTitle,
    private status: TaskStatus,
    private priority: TaskPriority,
    private createdAt: Date,
    private startedAt: Date | null,
    private finishedAt: Date | null,
    private deletedAt: Date | null,
    private labelsIds: LabelId[],
    private description: TaskDescription | null
  ) {}
  private static readonly MAX_LABELS = 5;

  // === Actions ===
  setToDo(): void {
    this.ensureIsToDo();
    this.status = TaskStatus.ToDo();

    this.startedAt = null;
  }
  start(): void {
    this.ensureIsStarted();
    this.status = TaskStatus.InProgress();

    this.startedAt = new Date();
  }
  reopen(): void {
    this.ensureIsReopened();
    this.status = TaskStatus.ToDo();
    // === Reset dates to track start again ===
    this.startedAt = null;
    this.finishedAt = null;
  }
  complete(): void {
    this.ensureIsDone();
    this.status = TaskStatus.Done();

    this.finishedAt = new Date();
  }
  archive(): void {
    this.ensureIsArchived();
    this.status = TaskStatus.Archived();
  }
  delete(): void {
    this.ensureIsDeleted();
    this.status = TaskStatus.Deleted();
    this.deletedAt = new Date();
  }
  rename(title: TaskTitle): void {
    this.ensureIsModified();
    this.title = title;
  }
  changePriority(priority: TaskPriority): void {
    this.ensureIsModified();
    this.priority = priority;
  }
  modifyDescription(description: TaskDescription): void {
    this.ensureIsModified();
    this.description = description;
  }
  addLabel(labelId: LabelId): void {
    // === Only N labels per task ===
    if (this.labelsIds.length >= Task.MAX_LABELS)
      throw new Error(`Only ${Task.MAX_LABELS} can be added to a Task`);
    // === Avoid duplicated labels ===
    if (!this.labelsIds.some((id) => id.equals(labelId))) this.labelsIds.push(labelId);
  }
  deleteLabel(labelId: LabelId): void {
    const originalLength = this.labelsIds.length;
    this.labelsIds = this.labelsIds.filter((id) => !id.equals(labelId));

    if (this.labelsIds.length === originalLength)
      throw new Error('Label does not exist in the Task');
  }

  // === Queries ===
  private ensureIsNotDeleted(): void {
    if (this.deletedAt) throw new Error('Error, task has already been deleted');
  }
  private ensureIsToDo(): void {
    this.ensureIsNotDeleted();
    if (this.status.isToDo()) throw new Error('Task is already set to-do');
    else if (!this.status.isInProgress()) throw new Error('Only started tasks can be set to do');
  }
  private ensureIsStarted(): void {
    this.ensureIsNotDeleted();
    if (this.status.isInProgress()) throw new Error('Task is already in progress');
    else if (!this.status.isToDo()) throw new Error('Only to-do tasks can be started');
  }
  private ensureIsReopened(): void {
    this.ensureIsNotDeleted();
    if (!this.status.isDone()) throw new Error('Only done tasks can be reopened');
  }
  private ensureIsDone(): void {
    this.ensureIsNotDeleted();
    if (this.status.isDone()) throw new Error('Task is already done');
    else if (!this.status.isInProgress()) throw new Error('Only started tasks can be set done');
  }
  private ensureIsArchived(): void {
    this.ensureIsNotDeleted();
    if (this.status.isArchived()) throw new Error('Task is already archived');
    else if (this.status.isDone() || this.status.isDeleted())
      throw new Error('Only to-do and started tasks can be archived');
  }
  private ensureIsDeleted(): void {
    this.ensureIsNotDeleted();
    if (this.status.isDeleted()) throw new Error('Task is already deleted');
    else if (this.status.isDone()) throw new Error('Completed tasks cannot be deleted');
  }
  private ensureIsModified(): void {
    this.ensureIsNotDeleted();
    if (!this.status.isInProgress() && !this.status.isToDo())
      throw new Error('Only to-do and started tasks can be renamed');
  }

  // === Utils ===
  static new(
    projectId: ProjectId,
    title: TaskTitle,
    priority: TaskPriority,
    labelsIds: LabelId[],
    description: TaskDescription
  ): Task {
    return new Task(
      TaskId.new(),
      projectId,
      title,
      TaskStatus.ToDo(),
      priority,
      new Date(),
      null,
      null,
      null,
      labelsIds,
      description
    );
  }
  static rehydrate(
    id: TaskId,
    projectId: ProjectId,
    title: TaskTitle,
    status: TaskStatus,
    priority: TaskPriority,
    createdAt: Date,
    startedAt: Date | null,
    finishedAt: Date | null,
    deletedAt: Date | null,
    labelsIds: LabelId[],
    description: TaskDescription | null
  ): Task {
    return new Task(
      id,
      projectId,
      title,
      status,
      priority,
      createdAt,
      startedAt,
      finishedAt,
      deletedAt,
      labelsIds,
      description
    );
  }
  toPrimitives() {
    return {
      id: this.id.toString(),
      projectId: this.projectId.toString(),
      title: this.title.toString(),
      status: this.status.toString(),
      priority: this.priority.toString(),
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      deletedAt: this.deletedAt,
      labelsIds: this.labelsIds.map((label) => label.toString()),
      description: this.description ? this.description.toString() : null,
    };
  }
  hasTitle(title: TaskTitle): boolean {
    return this.title === title;
  }
  getId(): TaskId {
    return this.id;
  }
  getLabelsIds(): LabelId[] {
    return this.labelsIds;
  }
}
