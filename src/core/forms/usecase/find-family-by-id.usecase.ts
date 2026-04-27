import { FamilyRepository } from '@/core/family/family.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { FamilyOutput } from '@/shared/output/family/family.output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

export type Input = {
  cpf: string;
};

export type Output = {
  family: FamilyOutput;
};

export class FindFamilyByIdUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.FAMILY_REPOSITORY)
    private readonly familyRepository: FamilyRepository,
  ) {}

  @Transactional()
  async execute({ cpf }: Input): Promise<Output> {
    const family = await this.familyRepository.findByCpf(cpf);

    if (!family) {
      throw new NotFoundError(`Família não encontrada`);
    }

    const output: Output = {
      family: {
        ...family,
      },
    };

    return output;
  }
}
