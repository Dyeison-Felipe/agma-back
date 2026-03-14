import { Injectable } from '@nestjs/common';
import { TransparencyTypeRepository } from './transparency-type.interface';
import { TransparencyTypeEntity } from './entities/transparency-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransparencyTypeRepositoryImpl implements TransparencyTypeRepository {
  constructor(
    @InjectRepository(TransparencyTypeEntity)
    private readonly transparencyTypeRepository: Repository<TransparencyTypeEntity>,
  ) {}

  async findById(id: string): Promise<TransparencyTypeEntity | null> {
    const transparencyType = await this.transparencyTypeRepository.findOne({
      where: { id },
    });

    if (!transparencyType) return null;

    return transparencyType;
  }

  async create(
    entity: TransparencyTypeEntity,
  ): Promise<TransparencyTypeEntity> {
    const saved = await this.transparencyTypeRepository.save(entity);

    return saved;
  }
}
