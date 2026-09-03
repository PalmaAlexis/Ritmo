import { StringUtils } from '@/shared/utils/string-utils';

export class ProjectCategory {
  private static MAX_LENGTH = 10;
  protected constructor(private value: string) {}

  static rehydrate(category: string): ProjectCategory {
    return new ProjectCategory(StringUtils.normalize(category));
  }
  static from(category: string): ProjectCategory {
    if (!category) throw new Error('Category cannot be empty');
    const normalized = StringUtils.normalize(category);
    if (normalized.length === 0) throw new Error('Category cannot be empty');

    if (normalized.length > this.MAX_LENGTH)
      throw new Error(`Category cannot exceed ${this.MAX_LENGTH} characters`);

    return new ProjectCategory(normalized);
  }

  equals(category: ProjectCategory): boolean {
    return this.value === category.value;
  }
  toString(): string {
    return this.value;
  }
}
