import { ProjectColorValues } from '@/shared/project-ui/color';

export class ProjectColor {
  private constructor(private value: ProjectColorValues) {}

  static rehydrate(value: string): ProjectColor {
    return new ProjectColor(value as ProjectColorValues);
  }
  static from(value: string): ProjectColor {
    if (!Object.values(ProjectColorValues).includes(value as ProjectColorValues))
      throw new Error('Not valid color for project');

    return new ProjectColor(value as ProjectColorValues);
  }

  equals(color: ProjectColor): boolean {
    return this.value === color.value;
  }
  toString(): ProjectColorValues {
    return this.value;
  }
}
