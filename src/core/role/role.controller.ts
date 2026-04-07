import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RoleRepositoryImpl } from './role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRolePresenter } from '@/shared/presenters/role/create-role.presenter';
import { CreateRoleUseCase } from './usecase/create.usecase';
import { UpdateRoleUseCase } from './usecase/update.usecase';
import { FindAllRoleUseCase } from './usecase/find-all-roles.usecase';
import { DeleteRoleUseCase } from './usecase/delete.usecase';
import { UpdateRolePresenter } from '@/shared/presenters/role/update-role.presenter';
import { FindAllRolePresenter } from '@/shared/presenters/role/find-all-roles.presenter';

@Controller('/v1/role')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly findAllRoleUseCase: FindAllRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateRoleDto): Promise<CreateRolePresenter> {
    return await this.createRoleUseCase.execute(body);
  }

  @Put()
  async update(@Body() body: UpdateRoleDto): Promise<UpdateRolePresenter> {
    return await this.updateRoleUseCase.execute(body);
  }

  @Get()
  async findAllRoles(): Promise<FindAllRolePresenter[]> {
    return await this.findAllRoleUseCase.execute();
  }

  @Delete(':roleId')
  async delete(@Param('roleId') roleId: string): Promise<void> {
    await this.deleteRoleUseCase.execute({ roleId });
  }
}
