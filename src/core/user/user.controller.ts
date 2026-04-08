// user.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from './usecase/create.usecase';
import { UpdateUserUseCase } from './usecase/update.usercase';
import { FindAllUserUseCase } from './usecase/find-all.usecase';
import { DeleteUserUseCase } from './usecase/delete.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserPresenter } from '@/shared/presenters/user/create-user.presenter';
import { UserPresenter } from '@/shared/presenters/user/user.presenter';
import { UpdateUserPresenter } from '@/shared/presenters/user/update-user.presenter';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('v1/user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CreateUserPresenter,
  })
  @ApiResponse({ status: 422, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserPresenter> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserPresenter],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(): Promise<UserPresenter[]> {
    return this.findAllUserUseCase.execute();
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar um usuário existente' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UpdateUserPresenter,
  })
  @ApiResponse({ status: 422, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  update(@Body() updateUserDto: UpdateUserDto): Promise<UpdateUserPresenter> {
    return this.updateUserUseCase.execute(updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um usuário pelo ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'ID do usuário a ser deletado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ idUser: id });
  }
}