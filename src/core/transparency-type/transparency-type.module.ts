import { Module } from '@nestjs/common';
import { TransparencyTypeController } from './transparency-type.controller';
import { PROVIDERS } from '@/shared/constants/providers';
import { TransparencyTypeRepositoryImpl } from './transparency-type.repository';
import { CreateTransparencyTypeUseCase } from './usecase/create-transparency-type.usecase';
import { TransparencyTypeRepository } from './transparency-type.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransparencyTypeEntity } from './entities/transparency-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransparencyTypeEntity])],
  controllers: [TransparencyTypeController],
  providers: [
    {
      provide: PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY,
      useClass: TransparencyTypeRepositoryImpl,
    },
    {
      provide: CreateTransparencyTypeUseCase,
      useFactory: (transparencyTypeRepository: TransparencyTypeRepository) => {
        return new CreateTransparencyTypeUseCase(transparencyTypeRepository);
      },
      inject: [PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY],
    },
  ],
  exports: [PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY],
})
export class TransparencyTypeModule {}
