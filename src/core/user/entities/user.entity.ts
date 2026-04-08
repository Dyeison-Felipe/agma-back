import { RoleEntity } from '@/core/role/entities/role.entity';
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

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 255, type: 'varchar' })
  name: string;

  @Column({ name: 'email', length: 255, type: 'varchar' })
  email: string;

  @Column({name: 'active', type: 'boolean', default: true})
  active: boolean

  @Column({ name: 'password', length: 255, type: 'varchar' })
  password: string;

  @Column({
    name: 'recover_password',
    type: 'text',
    nullable: true,
  })
  recover_password?: string;

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

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role' })
  role: RoleEntity;
}
