import { TransparencyPortalEntity } from "@/core/transparency-portal/entities/transparency-portal.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('transparency-types')
export class TransparencyTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'name', type: 'varchar', length: 255})
  name: string

  @OneToMany(() => TransparencyPortalEntity, (transparencyPortal) => transparencyPortal.transparencyType)
  transparencyPortal?: TransparencyPortalEntity[]
  
}
