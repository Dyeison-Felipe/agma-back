import { QuestionOptionEntity } from '@/core/question-options/entities/question-option.entity';
import { TypeQuestionEntity } from '@/core/type-question/entities/type-question.entity';
import { BaseSchema } from '@/shared/database/schema/base-schema';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('question')
export class QuestionEntity extends BaseSchema {
  @Column({ name: 'question', length: 1000 })
  question: string;

  @OneToMany(() => QuestionOptionEntity, (option) => option.question)
  options?: QuestionOptionEntity[];

  @ManyToOne(() => TypeQuestionEntity, (type) => type.question)
  @JoinColumn({ name: 'type_question_id' })
  typeQuestion: TypeQuestionEntity;
}
