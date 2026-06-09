export enum LabelColorValues {
  red = "RED",
  orange = "ORANGE",
  yellow = "YELLOW",
  green = "GREEN",
  blue = "BLUE",
  purple = "PURPLE",
  pink = "PINK",
  gray = "GRAY",
}

export class LabelColor {
  private constructor(private value: LabelColorValues) {}

  static rehydrate(color: string): LabelColor {
    if (!color) throw new Error("Color cannot be empty");
    return new LabelColor(color as LabelColorValues);
  }
  static from(color: string): LabelColor {
    if (!Object.values(LabelColorValues).includes(color as LabelColorValues))
      throw new Error(`´Not valid color ${color}`);

    return new LabelColor(color as LabelColorValues);
  }

  equals(color: LabelColor): boolean {
    return this.value === color.value;
  }
  toString(): string {
    return this.value;
  }
}
