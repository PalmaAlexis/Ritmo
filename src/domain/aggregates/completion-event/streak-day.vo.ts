export class StreakDay {
  private constructor(private value: string) {}

  // === Actions ===
  private static create(year: number, month: number, day: number): StreakDay {
    const value = [
      year.toString().padStart(4, '0'),
      month.toString().padStart(2, '0'),
      day.toString().padStart(2, '0'),
    ].join('-');

    return new StreakDay(value);
  }
  static fromLocalDate(date: Date): StreakDay {
    return StreakDay.create(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  // === Utils ===
  static rehydrate(value: string): StreakDay {
    return new StreakDay(value);
  }
  toString(): string {
    return this.value;
  }
  equals(other: StreakDay): boolean {
    return this.value === other.value;
  }
}
