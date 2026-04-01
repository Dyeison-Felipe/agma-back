import { Injectable } from '@nestjs/common';
import { CreateTransparencyPortalDto } from './dto/create-transparency-portal.dto';
import { UpdateTransparencyPortalDto } from './dto/update-transparency-portal.dto';
import { TransparencyPortalRepository } from './transparency-portal.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransparencyPortalEntity } from './entities/transparency-portal.entity';
import {
  Pagination,
  PaginationInput,
} from '@/shared/pagination-repository/pagination';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { paginateQuery } from '@/shared/database/paginate-query/paginate-query';

@Injectable()
export class TransparencyPortalServiceImpl implements TransparencyPortalRepository {
  constructor(
    @InjectRepository(TransparencyPortalEntity)
    private readonly transparencyRepository: Repository<TransparencyPortalEntity>,
  ) {}

  async findDocumentByTypeIdAndDocumentId(
    typeId: string,
    documentId: string,
  ): Promise<TransparencyPortalEntity | null> {
    const transparencyDocument = await this.transparencyRepository.findOne({
      where: { id: documentId, transparencyType: { id: typeId } },
    });

    if (!transparencyDocument) return null;

    return transparencyDocument;
  }

  async findAllByType(
    typeId: string,
    pagination: PaginationDto,
  ): Promise<Pagination<TransparencyPortalEntity>> {
    const queryBuilder = this.transparencyRepository
      .createQueryBuilder('tp')
      .leftJoinAndSelect('tp.transparencyType', 'type')
      .where('type.id = :typeId', { typeId })
      .orderBy('tp.createdAt', pagination.direction || 'ASC');

    const result = await paginateQuery(queryBuilder, pagination);

    return {
      items: result.items,
      meta: result.meta,
    };
  }

  async delete(id: string): Promise<void> {
    await this.transparencyRepository.softDelete(id);
  }

  async create(
    entity: TransparencyPortalEntity,
  ): Promise<TransparencyPortalEntity> {
    const schema = this.transparencyRepository.create(entity);

    const save = await this.transparencyRepository.save(schema);

    return save;
  }
}
