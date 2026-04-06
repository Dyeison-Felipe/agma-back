import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import type { TransparencyTypeRepository } from '../transparency-type.interface';
import { TransparencyTypeOutput } from '@/shared/output/transparency-type.output';
import { NotFoundError } from '@/shared/errors/not-found-error';

type Input = {
  id: string;
  name: string;
};

type Output = TransparencyTypeOutput;

export class UpdateTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const existTransparencyType =
      await this.transparencyTypeRepository.findById(input.id);

    if (!existTransparencyType) {
      throw new NotFoundError(
        `Nenhum tipo de transparência com o id: ${input.id} name: ${input.name} foi encontrado`,
      );
    }

    existTransparencyType.name = input.name;

    const updatedTransparencyType =
      await this.transparencyTypeRepository.update(existTransparencyType);

    const output: Output = {
      id: updatedTransparencyType.id,
      name: updatedTransparencyType.name,
      createdAt: updatedTransparencyType.createdAt,
      updatedAt: updatedTransparencyType.updatedAt,
    };

    return output;
  }
}
