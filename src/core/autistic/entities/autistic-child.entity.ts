import { FamilyEntity } from '@/core/family/entities/family.entity';
import { BaseSchema } from '@/shared/database/schema/base-schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('autist-child')
export class AutisticChildEntity extends BaseSchema {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'birth_date' })
  birthDate: string;

  @Column({ name: 'gender' })
  gender: string;

  @Column({ name: 'mother_name' })
  motherName: string;

  @Column({ name: 'father_name' })
  fatherName: string;

  @Column({ name: 'autism_condition' })
  autismCondition: string;

  @Column({ name: 'support_level' })
  supportLevel: string;

  @Column({ name: 'comorbidities' })
  comorbidities: string;

  @Column({ name: 'comorbidities_other', nullable: true })
  comorbiditiesOther?: string;

  @Column({ name: 'multiprofessional_support' })
  multiprofessionalSupport: boolean;

  @Column({ name: 'uses_medication' })
  usesMedication: boolean;

  @Column({ name: 'medication_names', nullable: true })
  medicationNames?: string;

  @Column({ name: 'school_grade' })
  schoolGrade: string;

  @Column({ name: 'school_name' })
  schoolName: string;

  @Column({ name: 'updateToken', nullable: true })
  updateToken?: string;

  @ManyToOne(() => FamilyEntity, (family) => family.autisticChild)
  @JoinColumn({ name: 'family_id' })
  family: FamilyEntity;
}
