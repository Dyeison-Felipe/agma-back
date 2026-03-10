import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import type { TransparencyTypeRepository } from '../transparency-type.interface';
import { TransparencyTypeOutput } from '@/shared/output/transparency-type.output';

type Input = {
  name: string;
};

type Output = TransparencyTypeOutput

export class CreateTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY)
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const saveTransparencyType = await this.transparencyTypeRepository.create({
      id: crypto.randomUUID(),
      name: input.name,
    });

    if (!saveTransparencyType) {
      throw new Error(`Ocorreu um erro ao salvar o tipo de transparencia`);
    }

    const output: Output = {
      id: saveTransparencyType.id,
      name: saveTransparencyType.name,
    };

    return output;
  }
}
