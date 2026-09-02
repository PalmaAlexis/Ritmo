export class StreakDay {
  private constructor(private readonly value: string) {}

  // === Actions ===
  private static create(year: number, month: number, day: number): StreakDay {
    StreakDay.ensureValidParts(year, month, day);

    const value = [
      year.toString().padStart(4, '0'),
      month.toString().padStart(2, '0'),
      day.toString().padStart(2, '0'),
    ].join('-');

    return new StreakDay(value);
  }
  static fromLocalDate(date: Date): StreakDay {
    if (Number.isNaN(date.getTime())) throw new Error('Invalid date for streak day');

    return StreakDay.create(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  // === Utils ===
  static rehydrate(value: string): StreakDay {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) throw new Error('Streak day must use YYYY-MM-DD format');

    return StreakDay.create(Number(match[1]), Number(match[2]), Number(match[3]));
  }
  toString(): string {
    return this.value;
  }
  equals(other: StreakDay): boolean {
    return this.value === other.value;
  }

  private static ensureValidParts(year: number, month: number, day: number): void {
    if (![year, month, day].every(Number.isInteger) || year < 1 || year > 9999)
      throw new Error('Invalid streak day');

    const candidate = new Date(0);
    candidate.setUTCHours(0, 0, 0, 0);
    candidate.setUTCFullYear(year, month - 1, day);

    if (
      candidate.getUTCFullYear() !== year ||
      candidate.getUTCMonth() !== month - 1 ||
      candidate.getUTCDate() !== day
    )
      throw new Error('Invalid streak day');
  }
}
