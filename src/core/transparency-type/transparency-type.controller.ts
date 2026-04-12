import { ROLE } from '@/shared/constants/roles';
import { Public } from '@/shared/decorators/public.decorator';
import { Roles } from '@/shared/decorators/role.decorator';
import { CreateTransparencyTypePresenter } from '@/shared/presenters/transparency-type/create-transparency-type.presenter';
import { FindAllTransparencyTypePresenter } from '@/shared/presenters/transparency-type/find-all-transparency-type.presenter';
import { UpdateTransparencyTypePresenter } from '@/shared/presenters/transparency-type/update-transparency-type.presenter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransparencyTypeDto } from './dto/create-transparency-type.dto';
import { UpdateTransparencyTypeDto } from './dto/update-transparency-type.dto';
import { CreateTransparencyTypeUseCase } from './usecase/create-transparency-type.usecase';
import { DeleteTransparencyTypeUseCase } from './usecase/delete-transparency-type.usecase';
import { FindAllTransparencyTypeUseCase } from './usecase/find-all-transparency.usecase';
import { UpdateTransparencyTypeUseCase } from './usecase/update-transparency-type.usecase';

@ApiTags('TransparencyType')
@Controller('v1/transparency-type')
export class TransparencyTypeController {
  constructor(
    private readonly createTransparencyTypeUseCase: CreateTransparencyTypeUseCase,
    private readonly findAllTransparencyTypeUseCase: FindAllTransparencyTypeUseCase,
    private readonly updateTransparencyTypeUseCase: UpdateTransparencyTypeUseCase,
    private readonly deleteTransparencyTypeUseCase: DeleteTransparencyTypeUseCase,
  ) {}

  @Roles(ROLE.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar um tipo de transparência' })
  @ApiBody({
    type: CreateTransparencyTypeDto,
    description: 'Dados para criação do tipo de transparência',
  })
  @ApiCreatedResponse({
    description: 'Tipo de transparência criado com sucesso',
    type: CreateTransparencyTypePresenter,
  })
  @ApiConflictResponse({
    description: 'Tipo de transparência já existe',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  async create(
    @Body() dto: CreateTransparencyTypeDto,
  ): Promise<CreateTransparencyTypePresenter> {
    return await this.createTransparencyTypeUseCase.execute(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Buscar todos os tipos de transparência' })
  @ApiOkResponse({
    description: 'Tipos de transparência encontrado com sucesso',
    type: FindAllTransparencyTypePresenter,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Nenhum tipo de transparência encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  async findAll(): Promise<FindAllTransparencyTypePresenter[]> {
    return await this.findAllTransparencyTypeUseCase.execute();
  }

  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Atualizar um tipo de transparência' })
  @ApiOkResponse({
    description: 'Tipos de transparência atualizado com sucesso',
    type: UpdateTransparencyTypePresenter,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Nenhum tipo de transparência encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  @Put()
  async update(
    @Body() updateDto: UpdateTransparencyTypeDto,
  ): Promise<UpdateTransparencyTypePresenter> {
    return await this.updateTransparencyTypeUseCase.execute(updateDto);
  }

  @Roles(ROLE.ADMIN)
  @ApiOperation({ summary: 'Deletar um tipo de transparência' })
  @ApiOkResponse({
    description: 'Tipo de transparência deletado com sucesso',
    type: UpdateTransparencyTypePresenter,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Nenhum tipo de transparência encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteTransparencyTypeUseCase.execute({ id });
  }
}
