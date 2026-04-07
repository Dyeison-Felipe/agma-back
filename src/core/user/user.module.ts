import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from './user.repository';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserRepositoryImpl],
})
export class UserModule {}
