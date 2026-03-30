import { TransparencyPortalEntity } from "./entities/transparency-portal.entity";

export interface TransparencyPortalRepository {
  create(entity: TransparencyPortalEntity): Promise<TransparencyPortalEntity>;
  delete(id: string): Promise<void>;
  findAllByType(typeId: string): Promise<TransparencyPortalEntity[] | null>;
}