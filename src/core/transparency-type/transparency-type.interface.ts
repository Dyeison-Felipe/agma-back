import { TransparencyTypeEntity } from "./entities/transparency-type.entity";

export interface TransparencyTypeRepository {
  create(entity: TransparencyTypeEntity): Promise<TransparencyTypeEntity>;
  findById(id: string): Promise<TransparencyTypeEntity | null>;
}