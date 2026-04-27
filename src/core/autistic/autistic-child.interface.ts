import { AutisticChildEntity } from '@/core/autistic/entities/autistic-child.entity';
import { Repository } from '@/shared/repository/repository';

export interface AutisticChildRepository extends Repository<AutisticChildEntity> {
  findAllByFamilyId(familyId: string): Promise<AutisticChildEntity[]>;
}
