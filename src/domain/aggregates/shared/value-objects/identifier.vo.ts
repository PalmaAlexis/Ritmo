export class Identifier {
  protected constructor(private value: string) {}

  static new(): Identifier {
    return new Identifier(crypto.randomUUID());
  }
  static rehydrate(id: string): Identifier {
    if (!id) throw new Error("Identifier cannot be empty");
    return new Identifier(id);
  }

  equals(id: Identifier): boolean {
    return this.value === id.value;
  }
  toString(): string {
    return this.value;
  }
}
