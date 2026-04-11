import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { TransparencyTypeOutput } from '@/shared/output/transparency-type/transparency-type.output';
import { UseCase } from '@/shared/usecase/usecase';
import type { TransparencyTypeRepository } from '../transparency-type.interface';

type Input = {
  id: string;
  name: string;
};

type Output = TransparencyTypeOutput;

export class UpdateTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}

  @Transactional()
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
