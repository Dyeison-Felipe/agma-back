import { Injectable } from '@nestjs/common';
import { CreateTransparencyPortalDto } from './dto/create-transparency-portal.dto';
import { UpdateTransparencyPortalDto } from './dto/update-transparency-portal.dto';
import { TransparencyPortalRepository } from './transparency-portal.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransparencyPortalEntity } from './entities/transparency-portal.entity';

@Injectable()
export class TransparencyPortalServiceImpl implements TransparencyPortalRepository {
  constructor(
    @InjectRepository(TransparencyPortalEntity)
    private readonly transparencyRepository: Repository<TransparencyPortalEntity>,
  ) {}

  async create(entity: TransparencyPortalEntity): Promise<TransparencyPortalEntity> {

    const schema = this.transparencyRepository.create(entity)

    const save = await this.transparencyRepository.save(schema);

    return save;
  }
}
