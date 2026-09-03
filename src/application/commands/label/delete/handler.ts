import { LabelId } from '@/domain/aggregates/label/id.vo';
import type { LabelRepository } from '@/domain/repositories/label.repository';
import type { Clock } from '../../../ports/clock';
import type { DeleteLabelCommand } from './command';

export class DeleteLabelHandler {
  constructor(
    private readonly labelRepository: LabelRepository,
    private readonly clock: Clock
  ) {}

  async execute(command: DeleteLabelCommand): Promise<void> {
    const id = LabelId.from(command.id);

    const label = await this.labelRepository.findById(id);
    if (!label) throw new Error('Label does not exist');

    label.delete(this.clock.now());
    await this.labelRepository.save(label);
  }
}
