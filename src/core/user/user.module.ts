import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from './user.repository';
import { UserController } from './user.controller';
import { PROVIDERS } from '@/shared/constants/providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleModule } from '../role/role.module';
import { HashModule } from '@/shared/hash/hash.module';
import { CreateUserUseCase } from './usecase/create.usecase';
import { UserRepository } from './user.interface';
import { RoleRepository } from '../role/role.interface';
import { HashService } from '@/shared/hash/hash.interface';
import { UpdateUserUseCase } from './usecase/update.usercase';
import { FindAllUserUseCase } from './usecase/find-all.usecase';
import { DeleteUserUseCase } from './usecase/delete.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule, HashModule],
  controllers: [UserController],
  providers: [
    {
      provide: PROVIDERS.USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        roleRepository: RoleRepository,
        HashService: HashService,
      ) => {
        return new CreateUserUseCase(
          userRepository,
          roleRepository,
          HashService,
        );
      },
      inject: [
        PROVIDERS.USER_REPOSITORY,
        PROVIDERS.ROLE_REPOSITORY,
        PROVIDERS.HASH_SERVICE,
      ],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        roleRepository: RoleRepository,
      ) => {
        return new UpdateUserUseCase(userRepository, roleRepository);
      },
      inject: [PROVIDERS.USER_REPOSITORY, PROVIDERS.ROLE_REPOSITORY],
    },
    {
      provide: FindAllUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new FindAllUserUseCase(userRepository);
      },
      inject: [PROVIDERS.USER_REPOSITORY],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new DeleteUserUseCase(userRepository);
      },
      inject: [PROVIDERS.USER_REPOSITORY],
    },
  ],

  exports: [PROVIDERS.USER_REPOSITORY],
})
export class UserModule {}
