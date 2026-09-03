import type { ProjectColorValues } from '@/shared/project-ui/color';
import type { ProjectIconValues } from '@/shared/project-ui/icon';
import type { ProjectStatusValues } from '@/shared/project/status';

export interface GetProjectDetailsModel {
  id: string;
  status: ProjectStatusValues;
  createdAt: Date;
  startedAt: Date | null;
  description: string;
  icon: ProjectIconValues;
  color: ProjectColorValues;
}
