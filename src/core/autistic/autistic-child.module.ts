import { AutisticChildEntity } from '@/core/autistic/entities/autistic-child.entity';
import { PROVIDERS } from '@/shared/constants/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutisticChildRepositoryImpl } from './autistic-child.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AutisticChildEntity])],
  controllers: [],
  providers: [
    {
      provide: PROVIDERS.AUTISTIC_CHILD_REPOSITORY,
      useClass: AutisticChildRepositoryImpl,
    },
  ],
  exports: [PROVIDERS.AUTISTIC_CHILD_REPOSITORY],
})
export class AutisticChildModule {}
