import { AutisticChildEntity } from '@/core/autistic/entities/autistic-child.entity';
import { BaseSchema } from '@/shared/database/schema/base-schema';
import { Column, Entity, OneToMany, VirtualColumn } from 'typeorm';

@Entity('family')
export class FamilyEntity extends BaseSchema {
  @Column({ name: 'email', length: 255 })
  email: string;

  @Column({ name: 'respondent' })
  respondent: string;

  @Column({ name: 'respondent_other', nullable: true })
  respondentOther?: string;

  @Column({ name: 'respondent_cpf', length: 14 })
  respondentCpf: string;

  @Column({ name: 'family_income' })
  familyIncome: string;

  @Column({ name: 'image_authorization' })
  imageAuthorization: boolean;

  @Column({ name: 'number_of_children' })
  numberOfChildren: string;

  @Column({ name: 'residence_type' })
  residenceType: string;

  @Column({ name: 'residence_type_other', nullable: true })
  residenceTypeOther?: string;

  @Column({ name: 'cep', type: 'varchar', nullable: true })
  cep?: string;

  @Column({ name: 'street' })
  street: string;

  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'neighborhood' })
  neighborhood: string;

  @Column({ name: 'reference_point', nullable: true })
  referencePoint?: string;

  @Column({ name: 'mother_phone' })
  motherPhone: string;

  @Column({ name: 'father_phone', nullable: true })
  fatherPhone?: string;

  @Column({ name: 'step_parent_name', nullable: true })
  stepParentName?: string;

  @Column({ name: 'bpc' })
  bpc: string;

  @Column({ name: 'cras_registration' })
  crasRegistration: boolean;

  @Column({ name: 'municipal_card' })
  municipalCard: boolean;

  @Column({ name: 'ciptea' })
  ciptea: boolean;

  @Column({ name: 'updateToken', type: 'varchar', nullable: true })
  updateToken?: string | null;

  @Column({ name: 'version', type: 'int', nullable: false })
  version?: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT COUNT(*)
      FROM family f2
      WHERE f2.respondent_cpf = ${alias}.respondent_cpf
        AND f2.deleted_at IS NULL
    `,
  })
  versionsCount?: number;

  @OneToMany(() => AutisticChildEntity, (child) => child.family)
  autisticChild?: AutisticChildEntity[];
}
