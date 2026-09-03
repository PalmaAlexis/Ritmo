import { StringUtils } from '@/shared/utils/string-utils';

export class Identifier {
  protected constructor(private value: string) {}

  static new(): Identifier {
    return new Identifier(crypto.randomUUID());
  }
  static from(value: string): Identifier {
    const normalized = StringUtils.normalize(value);
    if (!value || normalized.length === 0) throw new Error('Identifier cannot be empty');
    return new Identifier(normalized);
  }
  static rehydrate(id: string): Identifier {
    if (!id) throw new Error('Identifier cannot be empty');
    return new Identifier(id);
  }

  equals(id: Identifier): boolean {
    return this.value === id.value;
  }
  toString(): string {
    return this.value;
  }
}
