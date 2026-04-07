import { UserEntity } from './entities/user.entity';

export interface UserRepository {
  create(entity: UserEntity): Promise<UserEntity>;
  update(entity: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  delete(id: string): Promise<void>;
}
