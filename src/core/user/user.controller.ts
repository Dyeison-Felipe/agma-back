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
import { UserRepositoryImpl } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserUseCase } from './usecase/create.usecase';
import { UpdateUserUseCase } from './usecase/update.usercase';
import { FindAllUserUseCase } from './usecase/find-all.usecase';
import { DeleteUserUseCase } from './usecase/delete.usecase';

@Controller('v1/user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  findAll() {
    return this.findAllUserUseCase.execute();
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ idUser: id });
  }
}
