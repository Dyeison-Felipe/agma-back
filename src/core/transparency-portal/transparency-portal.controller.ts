import { Controller, Post, Body } from '@nestjs/common';
import { CreateTransparencyPortalDto } from './dto/create-transparency-portal.dto';
import { CreateTransparencyPortalUseCase } from './usecase/create-transparency-portal.usecase';
import { UploadedFileBuffer } from '@/shared/decorators/uploaded-file-buffer.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('TransparencyPortal')
@Controller('v1/transparency-portal')
export class TransparencyPortalController {
  constructor(
    private readonly createTransparencyPortalUseCase: CreateTransparencyPortalUseCase,
  ) {}

  @Post()
  create(
    @UploadedFileBuffer() file: Buffer,
    @Body() dto: CreateTransparencyPortalDto,
  ) {
    return this.createTransparencyPortalUseCase.execute({
      ...dto,
      fileBuffer: file,
    });
  }
}
