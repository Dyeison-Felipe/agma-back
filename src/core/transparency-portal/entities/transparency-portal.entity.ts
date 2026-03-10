import { TransparencyTypeEntity } from "@/core/transparency-type/entities/transparency-type.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('transparencyportal')
export class TransparencyPortalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'name'})
  name: string;

  @Column({name: 'path'})
  path: string;

  @ManyToOne(() => TransparencyTypeEntity, (transparencyType) => transparencyType.transparencyPortal)
  @JoinColumn({name: 'transparencyType'})
  transparencyType: TransparencyTypeEntity
}
