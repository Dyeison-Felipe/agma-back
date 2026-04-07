import { RoleEntity } from './entities/role.entity';

export interface RoleRepository {
  create(entity: RoleEntity): Promise<RoleEntity>;
  findById(id: string): Promise<RoleEntity | null>;
  update(entity: RoleEntity): Promise<RoleEntity>;
  delete(id: string): Promise<void>;
  findrelationsByUser(id: string): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>
  findAll(): Promise<RoleEntity[]>
}
