import { FamilyRepository } from '@/core/family/family.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import { AutisticOutput } from '@/shared/output/autistic/autistic.output';
import { FamilyOutput } from '@/shared/output/family/family.output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

export type Input = {
  cpf: string;
  token: string;
};

export type Output = {
  family: FamilyOutput;
  autisticChildren: AutisticOutput[];
};

export class FindFamilyByIdUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.FAMILY_REPOSITORY)
    private readonly familyRepository: FamilyRepository,
  ) {}

  @Transactional()
  async execute({ cpf, token }: Input): Promise<Output> {
    const family = await this.familyRepository.findByCpf(cpf);

    if (!family) {
      throw new NotFoundError(`Família não encontrada`);
    }

    if (!family.updateToken || family.updateToken !== token) {
      throw new UnauthorizedError(`Não autorizado`);
    }

    const { autisticChild, ...restFamily } = family;

    const output: Output = {
      family: {
        ...restFamily,
      },
      autisticChildren: autisticChild ?? [],
    };

    return output;
  }
}
