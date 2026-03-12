import { UseCase } from '@/shared/usecase/usecase';
import type { TransparencyPortalRepository } from '../transparency-portal.interface';
import { Inject } from '@nestjs/common';
import { PROVIDERS } from '@/shared/constants/providers';
import type { SupabaseService } from '@/shared/supabase/supabase..interface';
import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { TransparencyPortalOutput } from '@/shared/output/transparency-portal.output';
import { FileDto } from '@/shared/dto/file.dto';

type Input = {
  transparencyType: string;
  fileBuffer: FileDto;
};

type Output = TransparencyPortalOutput

export class CreateTransparencyPortalUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.TRANSPARENCY_PORTAL_REPOSITORY)
    private readonly transparencyRepository: TransparencyPortalRepository,
    @Inject(PROVIDERS.SUPABASE_SERVICE)
    private readonly supabaseService: SupabaseService,
    @Inject(PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY) private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}

  async execute(input: Input): Promise<Output> {

    const transparencyType = await this.transparencyTypeRepository.findById(input.transparencyType);

    if(!transparencyType) {
      throw new Error(`Tipo não encontrado`);
    }

    const fileName = `${crypto.randomUUID()}.pdf`

    const filepath = await this.supabaseService.uploadPdf(
      input.fileBuffer.buffer,
      fileName,
    );

    if (!filepath) {
      throw new Error(`Erro ao salvar o pdf`);
    }

    const savedTransparency = await this.transparencyRepository.create({
      id: crypto.randomUUID(),
      name: fileName,
      path: filepath,
      transparencyType: transparencyType
    });

    const output: Output = {
      id: savedTransparency.id,
      filename: savedTransparency.name,
      path: savedTransparency.path,
      transparencyType: savedTransparency.transparencyType,
    }

    return output;
  }
}
