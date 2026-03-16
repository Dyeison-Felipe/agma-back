import { Controller, Post, Body } from '@nestjs/common';
import { CreateTransparencyPortalDto, CreateTransparencyPortalMultipartDto } from './dto/create-transparency-portal.dto';
import { CreateTransparencyPortalUseCase } from './usecase/create-transparency-portal.usecase';
import { UploadedFileBuffer } from '@/shared/decorators/uploaded-file-buffer.decorator';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Multipart } from '@/shared/decorators/multipart.decorator';
import { CreateTransparencyPortalPresenter } from '@/shared/presenters/transparency-portal/create-transparency-portal.presenter';

@ApiTags('TransparencyPortal')
@Controller('v1/transparency-portal')
export class TransparencyPortalController {
  constructor(
    private readonly createTransparencyPortalUseCase: CreateTransparencyPortalUseCase,
  ) {}

  @Post()
  @Multipart()
    @ApiOperation({ summary: 'Criar uma transparência' })
    @ApiBody({
      type: CreateTransparencyPortalMultipartDto,
      description: 'Dados para criação da transparência'
    })
    @ApiCreatedResponse({
      description: 'Transparência criado com sucesso',
      type: CreateTransparencyPortalPresenter
    })
    @ApiConflictResponse({
      description: 'Transparência já existe'
    })
  create(
    @Body() dto: CreateTransparencyPortalMultipartDto,
  ): Promise<CreateTransparencyPortalPresenter> {
    return this.createTransparencyPortalUseCase.execute({
      transparencyType: dto.transparencyType,
      fileBuffer: dto.pdf,
    });
  }
}
