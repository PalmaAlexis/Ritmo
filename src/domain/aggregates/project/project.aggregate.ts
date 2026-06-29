import type { ProjectCategory } from './category.vo';
import type { ProjectColor } from './color.vo';
import type { ProjectDescription } from './description.vo';
import type { ProjectIcon } from './icon.vo';
import { ProjectId } from './id.vo';
import { ProjectStatus } from './status.vo';
import type { ProjectTitle } from './title.vo';

export class Project {
  private constructor(
    private readonly id: ProjectId,
    private title: ProjectTitle,
    private status: ProjectStatus,
    private createdAt: Date,
    private startedAt: Date | null,
    private finishedAt: Date | null,
    private deletedAt: Date | null,
    private description: ProjectDescription | null,
    private category: ProjectCategory,
    // === UI Customization ===
    private icon: ProjectIcon,
    private color: ProjectColor
  ) {}

  // === Actions ===
  setToDo(): void {
    this.ensureIsToDo();
    this.status = ProjectStatus.ToDo();

    this.startedAt = null;
  }
  start(): void {
    this.ensureIsStarted();
    this.status = ProjectStatus.InProgress();

    this.startedAt = new Date();
  }
  complete(): void {
    this.ensureIsDone();
    this.status = ProjectStatus.Done();

    this.finishedAt = new Date();
  }
  archive(): void {
    this.ensureIsArchived();
    this.status = ProjectStatus.Archived();
  }
  reopen(): void {
    this.ensureIsReopened();
    this.status = ProjectStatus.ToDo();
    // === Reset dates to track start again ===
    this.startedAt = null;
    this.finishedAt = null;
  }
  delete(): void {
    this.ensureIsDeleted();
    this.status = ProjectStatus.Deleted();
    this.deletedAt = new Date();
  }
  rename(title: ProjectTitle): void {
    this.ensureIsModified();
    this.title = title;
  }
  modifyDescription(description: ProjectDescription): void {
    this.ensureIsModified();
    this.description = description;
  }
  modifyCategory(category: ProjectCategory): void {
    this.ensureIsModified();
    this.category = category;
  }
  changeIcon(icon: ProjectIcon): void {
    // === Can change icon in any status ===
    this.icon = icon;
  }
  changeColor(color: ProjectColor): void {
    // === Can change color in any status ===
    this.color = color;
  }

  // === Queries ===
  private ensureIsNotDeleted(): void {
    if (this.deletedAt) throw new Error('Error, project has already been deleted');
  }
  private ensureIsToDo(): void {
    this.ensureIsNotDeleted();
    if (this.status.isToDo()) throw new Error('Project is already set to-do');
    else if (!this.status.isInProgress()) throw new Error('Only started Projects can be set to do');
  }
  private ensureIsStarted(): void {
    this.ensureIsNotDeleted();
    if (this.status.isInProgress()) throw new Error('Project is already in progress');
    else if (!this.status.isToDo()) throw new Error('Only to-do Projects can be started');
  }
  private ensureIsDone(): void {
    this.ensureIsNotDeleted();
    if (this.status.isDone()) throw new Error('Project is already done');
    else if (!this.status.isInProgress()) throw new Error('Only started Projects can be set done');
  }
  private ensureIsReopened(): void {
    this.ensureIsNotDeleted();
    if (!this.status.isDone()) throw new Error('Only Done Projects can be reopened');
  }
  private ensureIsArchived(): void {
    this.ensureIsNotDeleted();
    if (this.status.isArchived()) throw new Error('Project is already archived');
    else if (this.status.isDone() || this.status.isDeleted())
      throw new Error('Only to-do and started Projects can be archived');
  }
  private ensureIsDeleted(): void {
    this.ensureIsNotDeleted();
    if (this.status.isDeleted()) throw new Error('Project is already deleted');
    else if (this.status.isDone()) throw new Error('Completed Projects cannot be deleted');
  }
  private ensureIsModified(): void {
    this.ensureIsNotDeleted();
    if (!this.status.isInProgress() && !this.status.isToDo())
      throw new Error('Only to-do and started Projects can be renamed');
  }

  // === Utils ===
  static new(
    title: ProjectTitle,
    description: ProjectDescription,
    category: ProjectCategory,
    icon: ProjectIcon,
    color: ProjectColor
  ): Project {
    return new Project(
      ProjectId.new(),
      title,
      ProjectStatus.ToDo(),
      new Date(),
      null,
      null,
      null,
      description,
      category,
      icon,
      color
    );
  }
  rehydrate(
    id: ProjectId,
    title: ProjectTitle,
    status: ProjectStatus,
    createdAt: Date,
    startedAt: Date | null,
    finishedAt: Date | null,
    deletedAt: Date | null,
    description: ProjectDescription,
    category: ProjectCategory,
    icon: ProjectIcon,
    color: ProjectColor
  ): Project {
    return new Project(
      id,
      title,
      status,
      createdAt,
      startedAt,
      finishedAt,
      deletedAt,
      description,
      category,
      icon,
      color
    );
  }
  toPrimitives() {
    return {
      id: this.id.toString(),
      title: this.title.toString(),
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      deletedAt: this.deletedAt,
      description: this.description ? this.description.toString() : null,
      category: this.category.toString(),
      icon: this.icon.toString(),
      color: this.color.toString(),
    };
  }
  hasTitle(title: ProjectTitle) {
    return this.title === title;
  }
}
