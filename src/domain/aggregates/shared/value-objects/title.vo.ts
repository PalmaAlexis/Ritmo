import { StringUtils } from '../../../../shared/utils/string-utils';

export class Title {
  private static MAX_LENGTH = 24;
  protected constructor(private value: string) {}

  static rehydrate(title: string): Title {
    return new Title(StringUtils.normalize(title));
  }
  static from(title: string): Title {
    const normalized = StringUtils.normalize(title);
    if (!normalized || normalized.length === 0) throw new Error('Title cannot be empty');

    if (normalized.length > this.MAX_LENGTH)
      throw new Error(`Title cannot exceed ${this.MAX_LENGTH} characters`);

    return new Title(normalized);
  }

  equals(title: Title): boolean {
    return this.value === title.value;
  }
  toString(): string {
    return this.value;
  }
}
