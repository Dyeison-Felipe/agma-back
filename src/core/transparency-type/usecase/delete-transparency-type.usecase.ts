import { Transactional } from '@/shared/decorators/transactional.decorator';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { NotFoundError } from '@/shared/errors/not-found-error';
import type { SupabaseService } from '@/shared/supabase/supabase.interface';
import { UseCase } from '@/shared/usecase/usecase';
import type { TransparencyTypeRepository } from '../transparency-type.interface';

type Input = {
  id: string;
};

type Output = void;

export class DeleteTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
    private readonly supabaseSerice: SupabaseService,
  ) {}

  @Transactional()
  async execute({ id }: Input): Promise<void> {
    const transparencyType =
      await this.transparencyTypeRepository.findTransparenciesByType(id);

    if (!transparencyType) {
      throw new NotFoundError(`Nenhum tipo de trasparência foi encontrado`);
    }

    if (
      transparencyType.transparencyPortal &&
      transparencyType.transparencyPortal?.length >= 1
    ) {
      throw new BadRequestError(
        `Não é possivel remover um tipo de transparência que possui documentos vinculados `,
      );
    }

    await this.transparencyTypeRepository.delete(transparencyType);

    await this.supabaseSerice.deleteFolder(transparencyType.name);
  }
}
