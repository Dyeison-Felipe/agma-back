import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateRoleUseCase } from './usecase/create.usecase';
import { UpdateRoleUseCase } from './usecase/update.usecase';
import { FindAllRoleUseCase } from './usecase/find-all-roles.usecase';
import { DeleteRoleUseCase } from './usecase/delete.usecase';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRolePresenter } from '@/shared/presenters/role/create-role.presenter';
import { UpdateRolePresenter } from '@/shared/presenters/role/update-role.presenter';
import { FindAllRolePresenter } from '@/shared/presenters/role/find-all-roles.presenter';
import { Roles } from '@/shared/decorators/role.decorator';
import { ROLE } from '@/shared/constants/roles';

@ApiTags('Role')
@ApiBearerAuth()
@Roles(ROLE.ADMIN)
@Controller('/v1/role')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly findAllRoleUseCase: FindAllRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo cargo' })
  @ApiResponse({
    status: 201,
    description: 'Cargo criado com sucesso',
    type: CreateRolePresenter,
  })
  @ApiResponse({ status: 422, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Cargo já existe' })
  async create(@Body() body: CreateRoleDto): Promise<CreateRolePresenter> {
    return await this.createRoleUseCase.execute(body);
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar um cargo existente' })
  @ApiResponse({
    status: 200,
    description: 'Cargo atualizado com sucesso',
    type: UpdateRolePresenter,
  })
  @ApiResponse({ status: 422, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cargo não encontrado' })
  async update(@Body() body: UpdateRoleDto): Promise<UpdateRolePresenter> {
    return await this.updateRoleUseCase.execute(body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cargo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cargos retornada com sucesso',
    type: [FindAllRolePresenter],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllRoles(): Promise<FindAllRolePresenter[]> {
    return await this.findAllRoleUseCase.execute();
  }

  @Delete(':roleId')
  @ApiOperation({ summary: 'Deletar um cargo pelo ID' })
  @ApiParam({
    name: 'roleId',
    type: 'string',
    format: 'uuid',
    description: 'ID do cargo a ser deletado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Cargo deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cargo não encontrado' })
  async delete(@Param('roleId') roleId: string): Promise<void> {
    await this.deleteRoleUseCase.execute({ roleId });
  }
}
