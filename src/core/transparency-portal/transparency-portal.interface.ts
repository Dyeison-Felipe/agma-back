import { TransparencyPortalEntity } from "./entities/transparency-portal.entity";

export interface TransparencyPortalRepository {
  create(entity: TransparencyPortalEntity): Promise<TransparencyPortalEntity>;
}