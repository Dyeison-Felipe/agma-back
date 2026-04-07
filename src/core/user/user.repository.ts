import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.interface';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor() {}
}
