import { LabelColor } from "./color.vo";
import { LabelId } from "./id.vo";
import { LabelName } from "./name.vo";

export class Label {
  private constructor(
    private readonly id: LabelId,
    private name: LabelName,
    private color: LabelColor,
    private active: boolean,
  ) {}

  // === Actions ===
  static create(name: LabelName, color: LabelColor): Label {
    return new Label(LabelId.new(), name, color, true);
  }
  rename(name: LabelName): void {
    this.canBeModified();
    this.name = name;
  }
  changeColor(color: LabelColor): void {
    this.canBeModified();
    this.color = color;
  }
  delete(): void {
    this.canBeModified();
    this.active = false;
  }

  // === Queries ===
  canBeModified(): void {
    if (!this.isActive()) throw new Error("Only active labels can be modified");
  }

  // === Utils ===
  static rehydrate(
    id: LabelId,
    name: LabelName,
    color: LabelColor,
    active: boolean,
  ): Label {
    return new Label(id, name, color, active);
  }
  toPrimitive() {
    return {
      id: this.id.toString(),
      name: this.name.toString(),
      color: this.color.toString(),
    };
  }
  // === Getters ===
  getId(): LabelId {
    return this.id;
  }
  getName(): LabelName {
    return this.name;
  }
  getColor(): LabelColor {
    return this.color;
  }
  isActive(): boolean {
    return this.active;
  }
}
