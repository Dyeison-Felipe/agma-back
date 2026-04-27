import { FamilyPresenter } from '@/shared/presenters/family/family.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class FindFamilyPresenter {
  @ApiProperty({ type: FamilyPresenter })
  family: FamilyPresenter;
}
