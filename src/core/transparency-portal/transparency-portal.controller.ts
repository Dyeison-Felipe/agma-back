import { ROLE } from '@/shared/constants/roles';
import { Multipart } from '@/shared/decorators/multipart.decorator';
import { Public } from '@/shared/decorators/public.decorator';
import { Roles } from '@/shared/decorators/role.decorator';
import {
  MetaPresenter,
  PaginatedResponse,
  PaginationPresenter,
} from '@/shared/presenters/pagination/pagination.presenter';
import { CreateTransparencyPortalPresenter } from '@/shared/presenters/transparency-portal/create-transparency-portal.presenter';
import { FindAllTransparencyPortalPaginatedPresenter } from '@/shared/presenters/transparency-portal/find-all-transparency-portal-paginated.presenter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransparencyPortalMultipartDto } from './dto/create-transparency-portal.dto';
import { CreateTransparencyPortalUseCase } from './usecase/create-transparency-portal.usecase';
import { DeleteDocumentTransparencyPortalUseCase } from './usecase/delete-transparency-portal.usecase';
import { FindAllPaginatedTransparencyByTypeUseCase } from './usecase/find-all-paginated-transparency-by-type.usecase';

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
  @Roles(ROLE.ADMIN)
  async create(
    @Body() dto: CreateTransparencyPortalMultipartDto,
  ): Promise<CreateTransparencyPortalPresenter> {
    return await this.createTransparencyPortalUseCase.execute({
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
  @ApiExtraModels(FindAllTransparencyPortalPaginatedPresenter, MetaPresenter)
  @ApiOkResponse({
    description: 'Documentos encontrados',
    schema: PaginatedResponse(FindAllTransparencyPortalPaginatedPresenter),
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  @Public()
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
  })
  @ApiNotFoundResponse({
    description: 'Documento ou tipo de transparência não encontrados',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  @Roles(ROLE.ADMIN)
  @Delete('/:documentId')
  async deleteDocument(@Param('documentId') documentId: string): Promise<void> {
    await this.deleteDocumentTransparencyPortalUseCase.execute({
      documentId,
    });
  }
}
