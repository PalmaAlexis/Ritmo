export class StringUtils {
  private constructor() {}

  static normalize(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }
}
