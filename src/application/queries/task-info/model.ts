import type { TaskPriorityValues } from '@/shared/task/priority';
import type { TaskStatusValues } from '@/shared/task/status';

export interface GetTaskInfoModel {
  id: string;
  projectTitle: string;
  title: string;
  status: TaskStatusValues;
  priority: TaskPriorityValues;
  createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  labels: { id: string; name: string; color: string }[];
  description: string;
}
