import { FamilyEntity } from '@/core/family/entities/family.entity';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { Pagination } from '@/shared/pagination-repository/pagination';
import { Repository } from '@/shared/repository/repository';

export interface FamilyRepository extends Repository<FamilyEntity> {
  findByCpf(cpf: string): Promise<FamilyEntity | null>;
  findAllPaginated(
    pagination: PaginationDto,
    cpf?: string,
    version?: number,
  ): Promise<Pagination<FamilyEntity>>;
}
