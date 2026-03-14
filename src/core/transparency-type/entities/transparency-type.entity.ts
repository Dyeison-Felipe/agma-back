import { TransparencyPortalEntity } from '@/core/transparency-portal/entities/transparency-portal.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('transparency-type')
export class TransparencyTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamp' })
  deletedAt?: Date | null;

  @OneToMany(
    () => TransparencyPortalEntity,
    (transparencyPortal) => transparencyPortal.transparencyType,
  )
  transparencyPortal?: TransparencyPortalEntity[];
}
