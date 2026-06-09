import { StringUtils } from "../../../../shared/utils/string-utils";

export class Description {
  private static MAX_LENGTH = 100;
  protected constructor(private value: string) {}

  static rehydrate(text: string) {
    return new Description(StringUtils.normalize(text));
  }
  static from(text: string): Description {
    // === Description can be empty ===

    const normalized = StringUtils.normalize(text);
    if (normalized.length > this.MAX_LENGTH)
      throw new Error(
        `Description cannot exceed ${this.MAX_LENGTH} characters`,
      );

    return new Description(normalized);
  }

  equals(description: Description): boolean {
    return this.value === description.value;
  }
  toString(): string {
    return this.value;
  }
}
