import { PaginationDto } from '@/shared/dto/pagination.dto';
import { Pagination } from '@/shared/pagination-repository/pagination';
import { TransparencyPortalEntity } from './entities/transparency-portal.entity';

export type FindAllFilters = {
  typeId?: string;
};

export interface TransparencyPortalRepository {
  create(entity: TransparencyPortalEntity): Promise<TransparencyPortalEntity>;
  delete(id: string): Promise<void>;
  findAllByType(
    typeId: string,
    pagination: PaginationDto,
  ): Promise<Pagination<TransparencyPortalEntity>>;
  findAll(
    pagination: PaginationDto,
    filter?: FindAllFilters,
  ): Promise<Pagination<TransparencyPortalEntity>>;
  findDocumentByTypeIdAndDocumentId(
    documentId: string,
  ): Promise<TransparencyPortalEntity | null>;
}
