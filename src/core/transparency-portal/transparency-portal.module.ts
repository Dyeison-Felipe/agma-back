import { Module } from '@nestjs/common';
import { TransparencyPortalController } from './transparency-portal.controller';
import { PROVIDERS } from '@/shared/constants/providers';
import { TransparencyPortalServiceImpl } from './transparency-portal.repository';
import { CreateTransparencyPortalUseCase } from './usecase/create-transparency-portal.usecase';
import { TransparencyPortalRepository } from './transparency-portal.interface';
import { SupabaseService } from '@/shared/supabase/supabase..interface';
import { TransparencyTypeRepository } from '../transparency-type/transparency-type.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransparencyPortalEntity } from './entities/transparency-portal.entity';
import { TransparencyTypeModule } from '../transparency-type/transparency-type.module';
import { SupabaseModule } from '@/shared/supabase/supabase.module';
import { FindAllPaginatedTransparencyByTypeUseCase } from './usecase/find-all-paginated-transparency-by-type.usecase';
import { DeleteDocumentTransparencyPortalUseCase } from './usecase/delete-transparency-portal.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransparencyPortalEntity]),
    TransparencyTypeModule,
    SupabaseModule,
  ],
  controllers: [TransparencyPortalController],
  providers: [
    {
      provide: PROVIDERS.TRANSPARENCY_PORTAL_REPOSITORY,
      useClass: TransparencyPortalServiceImpl,
    },
    {
      provide: CreateTransparencyPortalUseCase,
      useFactory: (
        transparencyRepository: TransparencyPortalRepository,
        supabaseService: SupabaseService,
        transparencyTypeRepository: TransparencyTypeRepository,
      ) => {
        return new CreateTransparencyPortalUseCase(
          transparencyRepository,
          supabaseService,
          transparencyTypeRepository,
        );
      },
      inject: [
        PROVIDERS.TRANSPARENCY_PORTAL_REPOSITORY,
        PROVIDERS.SUPABASE_SERVICE,
        PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY,
      ],
    },
    {
      provide: FindAllPaginatedTransparencyByTypeUseCase,
      useFactory: (
        transparencyPortalRepository: TransparencyPortalRepository,
        transparencyTypeRepository: TransparencyTypeRepository,
      ) => {
        return new FindAllPaginatedTransparencyByTypeUseCase(
          transparencyPortalRepository,
          transparencyTypeRepository,
        );
      },
      inject: [
        PROVIDERS.TRANSPARENCY_PORTAL_REPOSITORY,
        PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY,
      ],
    },
    {
      provide: DeleteDocumentTransparencyPortalUseCase,
      useFactory: (
        transparencyRepository: TransparencyPortalRepository,
        transparencyTypeRepository: TransparencyTypeRepository,
        supabaseService: SupabaseService,
      ) => {
        return new DeleteDocumentTransparencyPortalUseCase(
          transparencyRepository,
          transparencyTypeRepository,
          supabaseService,
        );
      },
      inject: [
        PROVIDERS.TRANSPARENCY_PORTAL_REPOSITORY,
        PROVIDERS.TRANSPARENCY_TYPE_REPOSITORY,
        PROVIDERS.SUPABASE_SERVICE,
      ],
    },
  ],
  exports: [PROVIDERS.TRANSPARENCY_PORTAL_REPOSITORY],
})
export class TransparencyPortalModule {}
