import { AutisticPresenter } from '@/shared/presenters/autistic/autistic.presenter';
import { FamilyPresenter } from '@/shared/presenters/family/family.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormPresenter {
  @ApiProperty({ type: FamilyPresenter })
  family: FamilyPresenter;

  @ApiProperty({ type: [AutisticPresenter] })
  autisticChildren: AutisticPresenter[];
}
