import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { TransparencyPortalRepository } from '../transparency-portal.interface';
import { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { SupabaseService } from '@/shared/supabase/supabase.interface';
import { Transactional } from '@/shared/decorators/transactional.decorator';

type Input = { typeId: string; documentId: string };

type Output = void;

export class DeleteDocumentTransparencyPortalUseCase implements UseCase<
  Input,
  Output
> {
  constructor(
    private readonly transparencyPortalRepository: TransparencyPortalRepository,
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Transactional()
  async execute({ documentId, typeId }: Input): Promise<Output> {
    const transparencyType =
      await this.transparencyTypeRepository.findById(typeId);

    if (!transparencyType) {
      throw new NotFoundError(`Tipo de transparência não encontrado`);
    }

    const document =
      await this.transparencyPortalRepository.findDocumentByTypeIdAndDocumentId(
        transparencyType.id,
        documentId,
      );

    if (!document) {
      throw new NotFoundError(
        `Documento não encontrado para esse tipo de transparência`,
      );
    }

    await this.supabaseService.deleteFileByUrl(document.path);

    await this.transparencyPortalRepository.delete(document.id);
  }
}
