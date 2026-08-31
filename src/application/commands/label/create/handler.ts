import { LabelColor } from '../../../../domain/aggregates/label/color.vo';
import { Label } from '../../../../domain/aggregates/label/label.aggregate';
import { LabelName } from '../../../../domain/aggregates/label/name.vo';
import type { LabelRepository } from '../../../../domain/repositories/label.repository';
import type { CreateLabelCommand } from './command';

export class CreateLabelHandler {
  constructor(private readonly labelRepository: LabelRepository) {}

  async execute(command: CreateLabelCommand): Promise<void> {
    const name = LabelName.from(command.name);
    const color = LabelColor.from(command.color);

    // === No duplicated labels by name ===
    const duplicated = await this.labelRepository.existsByName(name);
    if (duplicated) throw new Error(`Label with name: ${name}, already exists`);

    const label = Label.new(name, color);
    await this.labelRepository.save(label);
  }
}
