import { Controller, Post, Body } from '@nestjs/common';
import { CreateTransparencyPortalDto, CreateTransparencyPortalMultipartDto } from './dto/create-transparency-portal.dto';
import { CreateTransparencyPortalUseCase } from './usecase/create-transparency-portal.usecase';
import { UploadedFileBuffer } from '@/shared/decorators/uploaded-file-buffer.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Multipart } from '@/shared/decorators/multipart.decorator';

@ApiTags('TransparencyPortal')
@Controller('v1/transparency-portal')
export class TransparencyPortalController {
  constructor(
    private readonly createTransparencyPortalUseCase: CreateTransparencyPortalUseCase,
  ) {}

  @Post()
  @Multipart()
  create(
    @Body() dto: CreateTransparencyPortalMultipartDto,
  ) {
    return this.createTransparencyPortalUseCase.execute({
      transparencyType: dto.dto.transparencyType,
      fileBuffer: dto.pdf,
    });
  }
}
