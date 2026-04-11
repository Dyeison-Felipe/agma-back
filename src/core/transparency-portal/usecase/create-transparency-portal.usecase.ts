import type { TransparencyTypeRepository } from '@/core/transparency-type/transparency-type.interface';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { FileDto } from '@/shared/dto/file.dto';
import { TransparencyPortalOutput } from '@/shared/output/trasnparency-portal/transparency-portal.output';
import type { SupabaseService } from '@/shared/supabase/supabase.interface';
import { UseCase } from '@/shared/usecase/usecase';
import type { TransparencyPortalRepository } from '../transparency-portal.interface';

type Input = {
  transparencyType: {
    id: string;
  };
  fileBuffer: FileDto;
};

type Output = TransparencyPortalOutput;

export class CreateTransparencyPortalUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly transparencyRepository: TransparencyPortalRepository,
    private readonly supabaseService: SupabaseService,
    private readonly transparencyTypeRepository: TransparencyTypeRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<Output> {
    const transparencyType = await this.transparencyTypeRepository.findById(
      input.transparencyType.id,
    );

    if (!transparencyType) {
      throw new Error(`Tipo não encontrado`);
    }

    const fileName = `${crypto.randomUUID()}${input.fileBuffer.extension}`;

    const filepath = await this.supabaseService.uploadPdf(
      input.fileBuffer.buffer,
      fileName,
      transparencyType.name,
    );

    if (!filepath) {
      throw new Error(`Erro ao salvar o pdf`);
    }

    const savedDocument = await this.transparencyRepository.create({
      id: crypto.randomUUID(),
      name: input.fileBuffer.filename,
      path: filepath,
      transparencyType: transparencyType,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const output: Output = {
      id: savedDocument.id,
      filename: savedDocument.name,
      path: savedDocument.path,
      transparencyType: savedDocument.transparencyType,
    };

    return output;
  }
}
