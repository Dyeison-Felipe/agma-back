import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.interface';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role']
    });

    if (!user) return null;

    return user;
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const saved = await this.userRepository.save(entity);

    return saved;
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    const saved = await this.userRepository.save(entity);

    return saved;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['role']
    });

    if (!user) return null;

    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({
      where: { active: true },
      relations: ['role']
    });

    return users;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
