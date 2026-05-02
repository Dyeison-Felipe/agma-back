import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { AutisticChildModule } from '@/core/autistic/autistic-child.module';
import { FamilyRepository } from '@/core/family/family.interface';
import { FamilyModule } from '@/core/family/family.module';
import { FormController } from '@/core/forms/forms.controller';
import { AdminUpdateFamilyUseCase } from '@/core/forms/usecase/admin-update-family.usecase';
import { CreateFormUseCase } from '@/core/forms/usecase/create-forms.usecase';
import { FindAllFamilysPaginatedUseCase } from '@/core/forms/usecase/find-all-familys-paginated.usecase';
import { FindFamilyByIdUseCase } from '@/core/forms/usecase/find-family-by-id.usecase';
import { GenerateTokenUseCase } from '@/core/forms/usecase/generate-token.usecase';
import { UpdateFamilyUseCase } from '@/core/forms/usecase/update-family.usecase';
import { PROVIDERS } from '@/shared/constants/providers';
import { JwtService } from '@/shared/jwt/jwt.interface';
import { Module } from '@nestjs/common';

@Module({
  imports: [FamilyModule, AutisticChildModule],
  controllers: [FormController],
  providers: [
    {
      provide: CreateFormUseCase,
      useFactory: (
        autistChildRepository: AutisticChildRepository,
        familyRepository: FamilyRepository,
      ) => {
        return new CreateFormUseCase(autistChildRepository, familyRepository);
      },
      inject: [
        PROVIDERS.AUTISTIC_CHILD_REPOSITORY,
        PROVIDERS.FAMILY_REPOSITORY,
      ],
    },
    {
      provide: FindAllFamilysPaginatedUseCase,
      useFactory: (familyRepository: FamilyRepository) => {
        return new FindAllFamilysPaginatedUseCase(familyRepository);
      },
      inject: [PROVIDERS.FAMILY_REPOSITORY],
    },
    {
      provide: GenerateTokenUseCase,
      useFactory: (
        familyRepository: FamilyRepository,
        jwtService: JwtService,
      ) => {
        return new GenerateTokenUseCase(familyRepository, jwtService);
      },
      inject: [PROVIDERS.FAMILY_REPOSITORY, PROVIDERS.JWT_SERVICE],
    },
    {
      provide: FindFamilyByIdUseCase,
      useFactory: (familyRepository: FamilyRepository) => {
        return new FindFamilyByIdUseCase(familyRepository);
      },
      inject: [PROVIDERS.FAMILY_REPOSITORY],
    },
    {
      provide: UpdateFamilyUseCase,
      useFactory: (
        autistChildRepository: AutisticChildRepository,
        familyRepository: FamilyRepository,
        jwtService: JwtService,
      ) => {
        return new UpdateFamilyUseCase(
          autistChildRepository,
          familyRepository,
          jwtService,
        );
      },
      inject: [
        PROVIDERS.AUTISTIC_CHILD_REPOSITORY,
        PROVIDERS.FAMILY_REPOSITORY,
        PROVIDERS.JWT_SERVICE,
      ],
    },
    {
      provide: AdminUpdateFamilyUseCase,
      useFactory: (
        autistChildRepository: AutisticChildRepository,
        familyRepository: FamilyRepository,
        jwtService: JwtService,
      ) => {
        return new AdminUpdateFamilyUseCase(
          autistChildRepository,
          familyRepository,
          jwtService,
        );
      },
      inject: [
        PROVIDERS.AUTISTIC_CHILD_REPOSITORY,
        PROVIDERS.FAMILY_REPOSITORY,
        PROVIDERS.JWT_SERVICE,
      ],
    },
  ],
  exports: [],
})
export class FormsModule {}
