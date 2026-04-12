import { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { SupabaseService } from '@/shared/supabase/supabase.interface';
import { UseCase } from '@/shared/usecase/usecase';
import { TransparencyPortalRepository } from '../transparency-portal.interface';

type Input = { documentId: string };

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
  async execute({ documentId }: Input): Promise<Output> {
    const document =
      await this.transparencyPortalRepository.findDocumentByTypeIdAndDocumentId(
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
