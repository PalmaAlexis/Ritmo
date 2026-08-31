import { LabelColor } from '../../../../domain/aggregates/label/color.vo';
import { LabelId } from '../../../../domain/aggregates/label/id.vo';
import { Label } from '../../../../domain/aggregates/label/label.aggregate';
import { LabelName } from '../../../../domain/aggregates/label/name.vo';
import type { SQLiteLabelRecord } from '../records/write/label.record';

export class SQLiteLabelMapper {
  static toDomain(persistence: SQLiteLabelRecord): Label {
    return Label.rehydrate(
      LabelId.rehydrate(persistence.id),
      LabelName.rehydrate(persistence.name),
      LabelColor.rehydrate(persistence.color),
      persistence.deletedAt ? new Date(persistence.deletedAt) : null
    );
  }

  static toPersistence(domain: Label): SQLiteLabelRecord {
    const primitives = domain.toPrimitives();
    return {
      id: primitives.id,
      name: primitives.name,
      color: primitives.color,
      deletedAt: primitives.deletedAt?.toISOString() ?? null,
    };
  }
}
