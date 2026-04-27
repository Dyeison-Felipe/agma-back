import { FamilyEntity } from '@/core/family/entities/family.entity';
import { PROVIDERS } from '@/shared/constants/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyRepositoryImpl } from './family.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyEntity])],
  controllers: [],
  providers: [
    {
      provide: PROVIDERS.FAMILY_REPOSITORY,
      useClass: FamilyRepositoryImpl,
    },
  ],
  exports: [PROVIDERS.FAMILY_REPOSITORY],
})
export class FamilyModule {}
