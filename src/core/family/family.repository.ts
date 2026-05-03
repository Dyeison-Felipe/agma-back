import { FamilyEntity } from '@/core/family/entities/family.entity';
import { FamilyRepository } from '@/core/family/family.interface';
import { paginateQuery } from '@/shared/database/paginate-query/paginate-query';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { Pagination } from '@/shared/pagination-repository/pagination';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/browser';

@Injectable()
export class FamilyRepositoryImpl implements FamilyRepository {
  constructor(
    @InjectRepository(FamilyEntity)
    private readonly familyRepository: Repository<FamilyEntity>,
  ) {}

  async findByCpf(cpf: string): Promise<FamilyEntity | null> {
    const family = await this.familyRepository.findOne({
      where: { respondentCpf: cpf },
      relations: ['autisticChild'],
      order: { version: 'DESC' },
    });

    if (!family) return null;

    return family;
  }
  async findAllPaginated(
    pagination: PaginationDto,
    cpf?: string,
    version?: number,
  ): Promise<Pagination<FamilyEntity>> {
    const queryBuilder = this.familyRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.autisticChild', 'autisticChild');

    if (cpf) {
      queryBuilder.where('respondentCpf = :cpf', { cpf });
    }
    queryBuilder.orderBy('f.createdAt', pagination.direction || 'ASC');

    if (version) {
      queryBuilder.where('version = :version', { version });
    } else {
      this.applyMaxVersionPerCpf(queryBuilder);
    }

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
    const queryBuilder = this.familyRepository.createQueryBuilder('f');

    this.applyMaxVersionPerCpf(queryBuilder);

    const families = await queryBuilder.getMany();

    return families;
  }

  async findById(id: string): Promise<FamilyEntity | null> {
    const family = await this.familyRepository.findOne({
      where: { id },
      relations: ['autisticChild'],
    });

    if (!family) return null;

    return family;
  }

  async deleteById(id: string): Promise<void> {
    await this.familyRepository.softDelete(id);
  }

  private applyMaxVersionPerCpf(
    qb: SelectQueryBuilder<FamilyEntity>,
  ): SelectQueryBuilder<FamilyEntity> {
    return qb.innerJoin(
      (subQb) =>
        subQb
          .select('f2.respondentCpf', 'cpf')
          .addSelect('MAX(f2.version)', 'maxversion')
          .from(FamilyEntity, 'f2')
          .groupBy('f2.respondentCpf'),
      'sub',
      'sub.cpf = f.respondentCpf AND sub.maxversion = f.version',
    );
  }
}
