import { AutisticChildRepository } from '@/core/autistic/autistic-child.interface';
import { AutisticChildEntity } from '@/core/autistic/entities/autistic-child.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AutisticChildRepositoryImpl implements AutisticChildRepository {
  constructor(
    @InjectRepository(AutisticChildEntity)
    private readonly autisiticChildRepository: Repository<AutisticChildEntity>,
  ) {}

  async findAllByFamilyId(familyId: string): Promise<AutisticChildEntity[]> {
    const autisticChilds = await this.autisiticChildRepository.find({
      where: { family: { id: familyId } },
      relations: ['family'],
    });

    return autisticChilds;
  }

  async save(entity: AutisticChildEntity): Promise<AutisticChildEntity> {
    const saved = await this.autisiticChildRepository.save(entity);

    return saved;
  }

  async update(entity: AutisticChildEntity): Promise<AutisticChildEntity> {
    const saved = await this.autisiticChildRepository.save(entity);

    return saved;
  }

  async findAll(): Promise<AutisticChildEntity[]> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<AutisticChildEntity | null> {
    const autisticChild = await this.autisiticChildRepository.findOne({
      where: { id },
      relations: ['family'],
    });

    return autisticChild;
  }

  async deleteById(id: string): Promise<void> {
    await this.autisiticChildRepository.softDelete(id);
  }
}
