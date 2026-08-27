import { LabelId } from '../../../../domain/aggregates/label/id.vo';
import type { TaskId } from '../../../../domain/aggregates/task/id.vo';
import type { SQLiteTaskLabelRecord } from '../records/task-label.record';

export class SQLiteTaskLabelMapper {
  static toDomain(persistence: SQLiteTaskLabelRecord[]): LabelId[] {
    return persistence.map((taskLabel) => LabelId.rehydrate(taskLabel.labelId));
  }

  static toPersistence(taskId: TaskId, labels: LabelId[]): SQLiteTaskLabelRecord[] {
    return labels.map((id) => ({
      taskId: taskId.toString(),
      labelId: id.toString(),
    }));
  }
}
