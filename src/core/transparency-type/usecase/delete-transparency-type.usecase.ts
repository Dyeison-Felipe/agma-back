import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import type { TransparencyTypeRepository } from '../transparency-type.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import type { SupabaseService } from '@/shared/supabase/supabase.interface';
import { BadRequestError } from '@/shared/errors/bad-request-error';

type Input = {
  id: string;
};

type Output = void;

export class DeleteTransparencyTypeUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
    private readonly supabaseSerice: SupabaseService,
  ) {}

  async execute({ id }: Input): Promise<void> {
    const transparencyType =
      await this.transparencyTypeRepository.findTransparenciesByType(id);

    if (!transparencyType) {
      throw new NotFoundError(`Nenhum tipo de trasparência foi encontrado`);
    }

    if (
      transparencyType.transparencyPortal &&
      transparencyType.transparencyPortal?.length > 1
    ) {
      throw new BadRequestError(
        `Não é possivel remover um tipo de transparência que possui documentos vinculados `,
      );
    }

    await this.transparencyTypeRepository.delete(transparencyType);

    await this.supabaseSerice.deleteFolder(transparencyType.name);
  }
}
