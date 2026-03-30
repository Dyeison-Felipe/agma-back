import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import type { TransparencyTypeRepository } from '../transparency-type.interface';
import { TransparencyTypeOutput } from '@/shared/output/transparency-type.output';
import { NotFoundError } from '@/shared/errors/not-found-error';

type Input = void;

type Output = TransparencyTypeOutput[];

export class FindAllTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY)
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const transparency = await this.transparencyTypeRepository.findAll();

    if (!transparency || transparency.length === 0) {
      throw new NotFoundError(`Nenhum tipo de transparencia encontrado`);
    }

    const output: Output = transparency.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return output;
  }
}
