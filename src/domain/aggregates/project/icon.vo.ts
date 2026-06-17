import { ProjectIconValues } from '../../../shared/project-ui/values';

export class ProjectIcon {
  private constructor(private value: ProjectIconValues) {}

  static rehydrate(value: string): ProjectIcon {
    return new ProjectIcon(value as ProjectIconValues);
  }
  static from(value: string): ProjectIcon {
    if (!Object.values(ProjectIconValues).includes(value as ProjectIconValues))
      throw new Error('Not valid icon for project');

    return new ProjectIcon(value as ProjectIconValues);
  }

  equals(color: ProjectIcon): boolean {
    return this.value === color.value;
  }
  toString(): ProjectIconValues {
    return this.value;
  }
}
