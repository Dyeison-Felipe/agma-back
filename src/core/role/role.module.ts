import { Module } from '@nestjs/common';
import { RoleRepositoryImpl } from './role.repository';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PROVIDERS } from '@/shared/constants/providers';
import { CreateRoleUseCase } from './usecase/create.usecase';
import { RoleRepository } from './role.interface';
import { UpdateRoleUseCase } from './usecase/update.usecase';
import { FindAllRoleUseCase } from './usecase/find-all-roles.usecase';
import { DeleteRoleUseCase } from './usecase/delete.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [
    {
      provide: PROVIDERS.ROLE_REPOSITORY,
      useClass: RoleRepositoryImpl,
    },
    {
      provide: CreateRoleUseCase,
      useFactory: (roleRepository: RoleRepository) => {
        return new CreateRoleUseCase(roleRepository);
      },
      inject: [PROVIDERS.ROLE_REPOSITORY],
    },
    {
      provide: UpdateRoleUseCase,
      useFactory: (roleRepository: RoleRepository) => {
        return new UpdateRoleUseCase(roleRepository);
      },
      inject: [PROVIDERS.ROLE_REPOSITORY],
    },
    {
      provide: FindAllRoleUseCase,
      useFactory: (roleRepository: RoleRepository) => {
        return new FindAllRoleUseCase(roleRepository);
      },
      inject: [PROVIDERS.ROLE_REPOSITORY],
    },
    {
      provide: DeleteRoleUseCase,
      useFactory: (roleRepository: RoleRepository) => {
        return new DeleteRoleUseCase(roleRepository);
      },
      inject: [PROVIDERS.ROLE_REPOSITORY],
    },
  ],
  exports: [PROVIDERS.ROLE_REPOSITORY],
})
export class RoleModule {}
