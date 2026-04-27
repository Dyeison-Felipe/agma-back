import { FamilyEntity } from '@/core/family/entities/family.entity';
import { FamilyRepository } from '@/core/family/family.interface';
import { paginateQuery } from '@/shared/database/paginate-query/paginate-query';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { Pagination } from '@/shared/pagination-repository/pagination';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FamilyRepositoryImpl implements FamilyRepository {
  constructor(
    @InjectRepository(FamilyEntity)
    private readonly familyRepository: Repository<FamilyEntity>,
  ) {}

  async findByCpf(cpf: string): Promise<FamilyEntity | null> {
    const family = await this.familyRepository.findOne({
      where: { respondentCpf: cpf },
    });

    if (!family) return null;

    return family;
  }
  async findAllPaginated(
    pagination: PaginationDto,
    cpf?: string,
  ): Promise<Pagination<FamilyEntity>> {
    const queryBuilder = this.familyRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.autisticChild', 'autisticChild');

    if (cpf) {
      queryBuilder.where('respondentCpf = :cpf', { cpf });
    }
    queryBuilder.orderBy('f.createdAt', pagination.direction || 'ASC');

    const result = await paginateQuery(queryBuilder, pagination);

    return {
      items: result.items,
      meta: result.meta,
    };
  }

  async save(entity: FamilyEntity): Promise<FamilyEntity> {
    const saved = await this.familyRepository.save(entity);

    return saved;
  }

  async update(entity: FamilyEntity): Promise<FamilyEntity> {
    const saved = await this.familyRepository.save(entity);

    return saved;
  }

  async findAll(): Promise<FamilyEntity[]> {
    const familys = await this.familyRepository.find();

    return familys;
  }

  async findById(id: string): Promise<FamilyEntity | null> {
    const family = await this.familyRepository.findOne({
      where: { id },
    });

    if (!family) return null;

    return family;
  }

  async deleteById(id: string): Promise<void> {
    await this.familyRepository.softDelete(id);
  }
}
