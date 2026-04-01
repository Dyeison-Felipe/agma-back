import { TransparencyTypeEntity } from "./entities/transparency-type.entity";

export interface TransparencyTypeRepository {
  delete(entity: TransparencyTypeEntity): Promise<void>;
  findByName(name: string): Promise<TransparencyTypeEntity | null>
  create(entity: TransparencyTypeEntity): Promise<TransparencyTypeEntity>;
  findById(id: string): Promise<TransparencyTypeEntity | null>;
  findAll(): Promise<TransparencyTypeEntity[] | null>;
  update(entity: TransparencyTypeEntity): Promise<TransparencyTypeEntity>;
  findTransparenciesByType(id: string): Promise<TransparencyTypeEntity | null>
}