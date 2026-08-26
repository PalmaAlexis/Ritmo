import type { LabelColorValues } from '../../../../shared/label-ui/color';

interface LabelModel {
  id: string;
  name: string;
  color: LabelColorValues;
}

export interface GetMostUsedLabelsModel {
  labels: LabelModel[];
}
