import { TransparencyTypeEntity } from '@/core/transparency-type/entities/transparency-type.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transparencyportal')
export class TransparencyPortalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'path' })
  path: string;

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

  @ManyToOne(
    () => TransparencyTypeEntity,
    (transparencyType) => transparencyType.transparencyPortal,
  )
  @JoinColumn({ name: 'transparencyType' })
  transparencyType: TransparencyTypeEntity;
}
