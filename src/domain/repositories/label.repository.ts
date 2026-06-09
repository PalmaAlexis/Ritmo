import type { LabelId } from '../aggregates/label/id.vo';
import type { Label } from '../aggregates/label/label.aggregate';
import type { LabelName } from '../aggregates/label/name.vo';

export interface LabelRepository {
  findById(id: LabelId): Promise<Label | null>;
  save(label: Label): Promise<void>;
  existsByName(name: LabelName): Promise<boolean>;
}
