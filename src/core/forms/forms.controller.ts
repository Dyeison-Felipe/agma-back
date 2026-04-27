// forms.controller.ts
import { CreateFormDto } from '@/core/forms/dto/create-form.dto';
import { UpdateFamilyFormDto } from '@/core/forms/dto/update-family.dto';
import { CreateFormUseCase } from '@/core/forms/usecase/create-forms.usecase';
import { FindAllFamilysPaginatedUseCase } from '@/core/forms/usecase/find-all-familys-paginated.usecase';
import { FindFamilyByIdUseCase } from '@/core/forms/usecase/find-family-by-id.usecase';
import { GenerateTokenUseCase } from '@/core/forms/usecase/generate-token.usecase';
import { UpdayeFamilyUseCase } from '@/core/forms/usecase/update-family.usecase';
import { Public } from '@/shared/decorators/public.decorator';
import { CreateFormPresenter } from '@/shared/presenters/form/create-form.presenter';
import { FindAllFamilysPaginatePresenter } from '@/shared/presenters/form/find-all-familys-pagination.presenter';
import { FindFamilyPresenter } from '@/shared/presenters/form/find-family.presenter';
import { UpdateFamilyPresenter } from '@/shared/presenters/form/update-family.presenter';
import { Pagination } from '@/shared/presenters/pagination/pagination.presenter';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Formulário')
@Controller('/v1/form')
export class FormController {
  constructor(
    private readonly createFormUseCase: CreateFormUseCase,
    private readonly findAllFamilisPaginatedUseCase: FindAllFamilysPaginatedUseCase,
    private readonly generateTokenUseCase: GenerateTokenUseCase,
    private readonly findFamilyByIdUseCase: FindFamilyByIdUseCase,
    private readonly updayeFamilyUseCase: UpdayeFamilyUseCase,
  ) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Cadastrar família e filhos autistas' })
  @ApiResponse({
    status: 201,
    type: CreateFormPresenter,
    description: 'Família cadastrada com sucesso',
  })
  @ApiResponse({ status: 409, description: 'Família já cadastrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() dto: CreateFormDto): Promise<CreateFormPresenter> {
    return await this.createFormUseCase.execute(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar famílias paginado' })
  @ApiResponse({ status: 200, description: 'Listagem retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Nenhuma família encontrada' })
  async findAllFamilysPaginate(
    @Query('cpf') cpf: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
  ): Promise<Pagination<FindAllFamilysPaginatePresenter>> {
    return await this.findAllFamilisPaginatedUseCase.execute({
      cpf,
      pagination: { limit, page },
    });
  }

  @Get('generate-link/family/:id')
  @Public()
  @ApiOperation({ summary: 'Gerar token de atualização para a família' })
  @ApiResponse({ status: 200, description: 'Token gerado com sucesso' })
  @ApiResponse({ status: 404, description: 'Família não encontrada' })
  async generateToken(@Param('id') id: string): Promise<{ token: string }> {
    return await this.generateTokenUseCase.execute({ id });
  }

  @Get('family/:cpf')
  @Public()
  @ApiOperation({ summary: 'Buscar família por CPF' })
  @ApiResponse({
    status: 200,
    type: FindFamilyPresenter,
    description: 'Família encontrada',
  })
  @ApiResponse({ status: 404, description: 'Família não encontrada' })
  async getFamily(@Param('cpf') cpf: string): Promise<FindFamilyPresenter> {
    return await this.findFamilyByIdUseCase.execute({ cpf });
  }

  @Put()
  @Public()
  @ApiOperation({ summary: 'Atualizar dados da família e filhos autistas' })
  @ApiResponse({
    status: 200,
    type: UpdateFamilyPresenter,
    description: 'Família atualizada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou não autorizado' })
  @ApiResponse({ status: 404, description: 'Família não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async updateFamily(
    @Body() dto: UpdateFamilyFormDto,
  ): Promise<UpdateFamilyPresenter> {
    return await this.updayeFamilyUseCase.execute(dto);
  }
}
