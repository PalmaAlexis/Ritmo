import type { LabelId } from '../../../../../domain/aggregates/label/id.vo';
import type { Label } from '../../../../../domain/aggregates/label/label.aggregate';
import type { LabelName } from '../../../../../domain/aggregates/label/name.vo';
import type { LabelRepository } from '../../../../../domain/repositories/label.repository';
import type { Database } from '../../../database';
import { SQLiteLabelMapper } from '../../mappers/label.mapper';
import type { SQLiteLabelRecord } from '../../records/label.record';

export class SQLiteLabelRepository implements LabelRepository {
  constructor(private readonly database: Database) {}

  async findById(id: LabelId): Promise<Label | null> {
    const record = await this.database.get<SQLiteLabelRecord>(
      `SELECT
          id,
          name,
          color,
          deleted_at AS deletedAt
        FROM labels
        WHERE id = ?
        AND deleted_at IS NULL
        LIMIT 1`,
      [id.toString()]
    );

    return record ? SQLiteLabelMapper.toDomain(record) : null;
  }

  async save(label: Label): Promise<void> {
    const persistence = SQLiteLabelMapper.toPersistence(label);
    await this.database.execute(
      `INSERT INTO labels
      (
          id,
          name,
          color,
          deleted_at
      )
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id)
      DO UPDATE SET
          name = excluded.name,
          color = excluded.color,
          deleted_at = excluded.deleted_at;`,
      [persistence.id, persistence.name, persistence.color, persistence.deletedAt]
    );
  }

  async existsByName(name: LabelName): Promise<boolean> {
    const record = await this.database.get<{ exists: number }>(
      `SELECT EXISTS(
          SELECT 1
          FROM labels
          WHERE name = ?
          AND deleted_at IS NULL
        ) AS exists`,
      [name.toString()]
    );

    return record?.exists === 1;
  }

  async existsAll(ids: LabelId[]): Promise<boolean> {
    const uniqueIds = [...new Set(ids.map((id) => id.toString()))];
    if (uniqueIds.length === 0) return true;

    const placeholders = uniqueIds.map(() => '?').join(', ');
    const record = await this.database.get<{ labelCount: number }>(
      `SELECT COUNT(*) AS labelCount
        FROM labels
        WHERE id IN (${placeholders})
        AND deleted_at IS NULL`,
      uniqueIds
    );

    return record?.labelCount === uniqueIds.length;
  }
}
