import { StringUtils } from '../../../shared/utils/string-utils';

export class LabelName {
  private static MAX_LENGTH = 10;
  protected constructor(private value: string) {}

  static rehydrate(label: string): LabelName {
    return new LabelName(StringUtils.normalize(label));
  }
  static from(label: string): LabelName {
    if (!label || label.length === 0) throw new Error('Label cannot be empty');
    const normalized = StringUtils.normalize(label);

    if (normalized.length > this.MAX_LENGTH)
      throw new Error(`Label cannot exceed ${this.MAX_LENGTH} characters`);

    return new LabelName(normalized);
  }

  equals(label: LabelName): boolean {
    return this.value === label.value;
  }
  toString(): string {
    return this.value;
  }
}
