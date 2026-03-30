import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import type { TransparencyTypeRepository } from '../transparency-type.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

type Input = {
  id: string;
};

type Output = void;

export class DeleteTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY)
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}
  async execute({id}: Input): Promise<void> {
    const existTransparencyType = await this.transparencyTypeRepository.findById(id);

    if(!existTransparencyType) {
      throw new NotFoundError(`Nenhum tipo de trasparência foi encontrado`)
    }

    await this.transparencyTypeRepository.delete(existTransparencyType);
  }
}
