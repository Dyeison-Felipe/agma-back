import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import {
  CreateTransparencyPortalDto,
  CreateTransparencyPortalMultipartDto,
} from './dto/create-transparency-portal.dto';
import { CreateTransparencyPortalUseCase } from './usecase/create-transparency-portal.usecase';
import { UploadedFileBuffer } from '@/shared/decorators/uploaded-file-buffer.decorator';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Multipart } from '@/shared/decorators/multipart.decorator';
import { CreateTransparencyPortalPresenter } from '@/shared/presenters/transparency-portal/create-transparency-portal.presenter';
import { FindAllPaginatedTransparencyByTypeUseCase } from './usecase/find-all-paginated-transparency-by-type.usecase';
import { PaginationPresenter } from '@/shared/presenters/pagination/pagination.presenter';
import { FindAllTransparencyPortalPaginatedPresenter } from '@/shared/presenters/transparency-portal/find-all-transparency-portal-paginated.presenter';
import { DeleteDocumentTransparencyPortalUseCase } from './usecase/delete-transparency-portal.usecase';

@ApiTags('TransparencyPortal')
@Controller('v1/transparency-portal')
export class TransparencyPortalController {
  constructor(
    private readonly createTransparencyPortalUseCase: CreateTransparencyPortalUseCase,
    private readonly findAllPaginatedTransparencyByType: FindAllPaginatedTransparencyByTypeUseCase,
    private readonly deleteDocumentTransparencyPortalUseCase: DeleteDocumentTransparencyPortalUseCase,
  ) {}

  @Post()
  @Multipart()
  @ApiOperation({ summary: 'Adicionar um documento a um tipo de transparênci' })
  @ApiBody({
    type: CreateTransparencyPortalMultipartDto,
    description: 'Dados para adição do documento no tipo da transparência',
  })
  @ApiCreatedResponse({
    description: 'Documento adicinado com sucesso',
    type: CreateTransparencyPortalPresenter,
  })
  @ApiConflictResponse({
    description: 'Documento já existe',
  })
  create(
    @Body() dto: CreateTransparencyPortalMultipartDto,
  ): Promise<CreateTransparencyPortalPresenter> {
    return this.createTransparencyPortalUseCase.execute({
      transparencyType: dto.transparencyType,
      fileBuffer: dto.pdf,
    });
  }

  @ApiOperation({
    summary: 'Buscar os documentos de um tipo de transparência paginado',
  })
  @ApiQuery({
    name: 'transparencyType',
    required: true,
    type: String,
    description: 'ID do tipo de transparência',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade de itens por página',
  })
  @ApiOkResponse({
    description: 'Documentos encontrados',
    type: CreateTransparencyPortalPresenter,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  @Get()
  async findAllPaginated(
    @Query('transparencyType') transparencyType: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
  ): Promise<PaginationPresenter<FindAllTransparencyPortalPaginatedPresenter>> {
    return await this.findAllPaginatedTransparencyByType.execute({
      transparencyTypeId: transparencyType,
      pagination: {
        limit,
        page,
      },
    });
  }

  @ApiOperation({ summary: 'Deletar um documento' })
  @ApiOkResponse({
    description: 'Documento removido com sucesso',
    type: CreateTransparencyPortalPresenter,
  })
  @ApiNotFoundResponse({
    description: 'Documento ou tipo de transparência não encontrados',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  @Delete('type/:typeId/document/:documentId')
  async deleteDocument(
    @Param('typeId') typeId: string,
    @Param('documentId') documentId: string,
  ): Promise<void> {
    await this.deleteDocumentTransparencyPortalUseCase.execute({
      typeId,
      documentId,
    });
  }
}
