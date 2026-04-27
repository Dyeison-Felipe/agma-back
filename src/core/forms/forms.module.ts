import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { AutisticChildModule } from '@/core/autistic/autistic-child.module';
import { FamilyRepository } from '@/core/family/family.interface';
import { FamilyModule } from '@/core/family/family.module';
import { FormController } from '@/core/forms/forms.controller';
import { CreateFormUseCase } from '@/core/forms/usecase/create-forms.usecase';
import { FindAllFamilysPaginatedUseCase } from '@/core/forms/usecase/find-all-familys-paginated.usecase';
import { PROVIDERS } from '@/shared/constants/providers';
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
  ],
  exports: [],
})
export class FormsModule {}
