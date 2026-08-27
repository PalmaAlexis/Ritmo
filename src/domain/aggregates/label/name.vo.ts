import { StringUtils } from '../../../shared/utils/string-utils';

export class LabelName {
  private static MAX_LENGTH = 10;
  protected constructor(private value: string) {}

  static rehydrate(name: string): LabelName {
    return new LabelName(StringUtils.normalize(name));
  }
  static from(name: string): LabelName {
    if (!name) throw new Error('Label name cannot be empty');
    const normalized = StringUtils.normalize(name);
    if (normalized.length === 0) throw new Error('Label name cannot be empty');

    if (normalized.length > this.MAX_LENGTH)
      throw new Error(`Label name cannot exceed ${this.MAX_LENGTH} characters`);

    return new LabelName(normalized);
  }

  equals(name: LabelName): boolean {
    return this.value === name.value;
  }
  toString(): string {
    return this.value;
  }
}
