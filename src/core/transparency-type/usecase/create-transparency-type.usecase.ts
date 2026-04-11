import { Transactional } from '@/shared/decorators/transactional.decorator';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { ConflictError } from '@/shared/errors/conflict-error';
import { TransparencyTypeOutput } from '@/shared/output/transparency-type/transparency-type.output';
import { UseCase } from '@/shared/usecase/usecase';
import type { TransparencyTypeRepository } from '../transparency-type.interface';

type Input = {
  name: string;
};

type Output = TransparencyTypeOutput;

export class CreateTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<Output> {
    const transparencyType = await this.transparencyTypeRepository.findByName(
      input.name,
    );

    if (transparencyType) {
      throw new ConflictError(
        `Já existe um tipo de transparência com o nome ${input.name}`,
      );
    }

    const saveTransparencyType = await this.transparencyTypeRepository.create({
      id: crypto.randomUUID(),
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!saveTransparencyType) {
      throw new BadRequestError(
        `Ocorreu um erro ao salvar o tipo de transparência`,
      );
    }

    const output: Output = {
      id: saveTransparencyType.id,
      name: saveTransparencyType.name,
      createdAt: saveTransparencyType.createdAt,
      updatedAt: saveTransparencyType.updatedAt,
    };

    return output;
  }
}
