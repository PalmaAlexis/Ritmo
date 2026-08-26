import type { LabelColor } from './color.vo';
import { LabelId } from './id.vo';
import type { LabelName } from './name.vo';

export class Label {
  private constructor(
    private readonly id: LabelId,
    private name: LabelName,
    private color: LabelColor,
    private deletedAt: Date | null
  ) {}

  // === Actions ===
  static new(name: LabelName, color: LabelColor): Label {
    return new Label(LabelId.new(), name, color, null);
  }
  delete(): void {
    this.ensureIsNotDeleted();
    this.deletedAt = new Date();
  }

  // === Queries ===
  private ensureIsNotDeleted(): void {
    if (this.deletedAt) throw new Error('Error, label has already been deleted');
  }

  // === Utils ===
  static rehydrate(id: LabelId, name: LabelName, color: LabelColor, deletedAt: Date | null): Label {
    return new Label(id, name, color, deletedAt);
  }
  toPrimitive() {
    return {
      id: this.id.toString(),
      name: this.name.toString(),
      color: this.color.toString(),
    };
  }
}
