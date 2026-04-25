import { QuestionEntity } from '@/core/questions/entities/question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('type-question')
export class TypeQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'type' })
  type: string;

  @OneToMany(() => QuestionEntity, (question) => question.typeQuestion)
  question: QuestionEntity[];
}
