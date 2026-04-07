import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleRepositoryImpl implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(): Promise<RoleEntity[]> {
    const roles = await this.roleRepository.find();

    return roles;
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const role = await this.roleRepository.findOne({
      where: { name },
    });

    if (!role) return null;

    return role;
  }

  async create(entity: RoleEntity): Promise<RoleEntity> {
    const saveRole = await this.roleRepository.save(entity);

    return saveRole;
  }

  async findById(id: string): Promise<RoleEntity | null> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) return null;

    return role;
  }

  async update(entity: RoleEntity): Promise<RoleEntity> {
    const saveRole = await this.roleRepository.save(entity);

    return saveRole;
  }

  async delete(id: string): Promise<void> {
    await this.roleRepository.softDelete(id);
  }

  async findrelationsByUser(id: string): Promise<RoleEntity | null> {
    throw new Error('Method not implemented.');
  }
}
