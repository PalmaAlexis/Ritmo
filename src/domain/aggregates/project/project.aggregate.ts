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
    private description: ProjectDescription,
    private category: ProjectCategory,
    // === UI Customization ===
    private icon: ProjectIcon,
    private color: ProjectColor
  ) {}

  // === Actions ===
  setToDo(): void {
    this.canBeToDo();
    this.status = ProjectStatus.ToDo();

    this.startedAt = null;
  }
  start(): void {
    this.canBeStarted();
    this.status = ProjectStatus.InProgress();

    this.startedAt = new Date();
  }
  complete(): void {
    this.canBeDone();
    this.status = ProjectStatus.Done();

    this.finishedAt = new Date();
  }
  archive(): void {
    this.canBeArchived();
    this.status = ProjectStatus.Archived();
  }
  reopen(): void {
    this.canBeReopened();
    this.status = ProjectStatus.ToDo();
    // === Reset dates to track start again ===
    this.startedAt = null;
    this.finishedAt = null;
  }
  delete(): void {
    this.canBeDeleted();
    this.status = ProjectStatus.Deleted();
  }
  rename(title: ProjectTitle): void {
    this.canBeModified();
    this.title = title;
  }
  modifyDescription(description: ProjectDescription): void {
    this.canBeModified();
    this.description = description;
  }
  modifyCategory(category: ProjectCategory): void {
    this.canBeModified();
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
  private canBeToDo(): void {
    if (this.status.isToDo()) throw new Error('Project is already set to-do');
    else if (!this.status.isInProgress()) throw new Error('Only started Projects can be set to do');
  }
  private canBeStarted(): void {
    if (this.status.isInProgress()) throw new Error('Project is already in progress');
    else if (!this.status.isToDo()) throw new Error('Only to-do Projects can be started');
  }
  private canBeDone(): void {
    if (this.status.isDone()) throw new Error('Project is already done');
    else if (!this.status.isInProgress()) throw new Error('Only started Projects can be set done');
  }
  private canBeReopened(): void {
    if (!this.status.isDone()) throw new Error('Only Done Projects can be reopened');
  }
  private canBeArchived(): void {
    if (this.status.isArchived()) throw new Error('Project is already archived');
    else if (this.status.isDone() || this.status.isDeleted())
      throw new Error('Only to-do and started Projects can be archived');
  }
  private canBeDeleted(): void {
    if (this.status.isDeleted()) throw new Error('Project is already deleted');
    else if (this.status.isDone()) throw new Error('Completed Projects cannot be deleted');
  }
  private canBeModified(): void {
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
      description: this.description.toString(),
      category: this.category.toString(),
    };
  }
  hasTitle(title: ProjectTitle) {
    return this.title === title;
  }
}
