import type { LabelId } from '../label/id.vo';
import type { ProjectId } from '../project/id.vo';
import type { TaskDescription } from './description.vo';
import { TaskId } from './id.vo';
import type { TaskPriority } from './priority.vo';
import { TaskStatus } from './status.vo';
import type { TaskTitle } from './title.vo';

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
    private labelsIds: LabelId[],
    private description: TaskDescription
  ) {}

  // === Actions ===
  setToDo(): void {
    this.canBeToDo();
    this.status = TaskStatus.ToDo();

    this.startedAt = null;
  }
  start(): void {
    this.canBeInProgress();
    this.status = TaskStatus.InProgress();

    this.startedAt = new Date();
  }
  reopen(): void {
    this.canBeReopened();
    this.status = TaskStatus.InProgress();

    this.startedAt = new Date();
    this.finishedAt = null;
  }
  complete(): void {
    this.canBeDone();
    this.status = TaskStatus.Done();

    this.finishedAt = new Date();
  }
  archive(): void {
    this.canBeArchived();
    this.status = TaskStatus.Archived();
  }
  delete(): void {
    this.canBeDeleted();
    this.status = TaskStatus.Deleted();
  }
  rename(title: TaskTitle): void {
    this.canBeModified();
    this.title = title;
  }
  changePriority(priority: TaskPriority): void {
    this.canBeModified();
    this.priority = priority;
  }
  modifyDescription(description: TaskDescription): void {
    this.canBeModified();
    this.description = description;
  }
  addLabel(labelId: LabelId): void {
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
  private canBeToDo(): void {
    if (this.status.isToDo()) throw new Error('Task is already set to-do');
    else if (!this.status.isInProgress()) throw new Error('Only started tasks can be set to do');
  }
  private canBeInProgress(): void {
    if (this.status.isInProgress()) throw new Error('Task is already in progress');
    else if (!this.status.isToDo()) throw new Error('Only to-do tasks can be started');
  }
  private canBeReopened(): void {
    if (this.status.isInProgress()) throw new Error('Task is already opened');
    else if (!this.status.isDone()) throw new Error('Only done tasks can be reopened');
  }
  private canBeDone(): void {
    if (this.status.isDone()) throw new Error('Task is already done');
    else if (!this.status.isInProgress()) throw new Error('Only started tasks can be set done');
  }
  private canBeArchived(): void {
    if (this.status.isArchived()) throw new Error('Task is already archived');
    else if (this.status.isDone() || this.status.isDeleted())
      throw new Error('Only to-do and started tasks can be archived');
  }
  private canBeDeleted(): void {
    if (this.status.isDeleted()) throw new Error('Task is already deleted');
    else if (this.status.isDone()) throw new Error('Completed tasks cannot be deleted');
  }
  private canBeModified(): void {
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
      labelsIds,
      description
    );
  }
  rehydrate(
    id: TaskId,
    projectId: ProjectId,
    title: TaskTitle,
    status: TaskStatus,
    priority: TaskPriority,
    createdAt: Date,
    startedAt: Date | null,
    finishedAt: Date | null,
    labelsIds: LabelId[],
    description: TaskDescription
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
      labelsIds,
      description
    );
  }
  toPrimitives() {
    return {
      id: this.id.toString(),
      projectId: this.projectId.toString(),
      title: this.title.toString(),
      priority: this.priority.toString(),
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      labelsIds: this.labelsIds.map((label) => label.toString()),
      description: this.description.toString(),
    };
  }
  getId(): TaskId {
    return this.id;
  }
  getProjectId(): ProjectId {
    return this.projectId;
  }
  getTitle(): TaskTitle {
    return this.title;
  }
  getPriority(): TaskPriority {
    return this.priority;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getStartedAt(): Date | null {
    return this.startedAt;
  }
  getFinishedAt(): Date | null {
    return this.finishedAt;
  }
  getLabelsId(): LabelId[] {
    return this.labelsIds;
  }
  getDescription(): TaskDescription {
    return this.description;
  }
}
