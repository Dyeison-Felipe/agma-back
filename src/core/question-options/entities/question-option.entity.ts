import { QuestionEntity } from '@/core/questions/entities/question.entity';
import { BaseSchema } from '@/shared/database/schema/base-schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('question-options')
export class QuestionOptionEntity extends BaseSchema {
  @Column({ name: 'option', nullable: false })
  option: string;

  @Column({ name: 'allows_custom_text', default: false })
  allowsCustomText: boolean;

  @ManyToOne(() => QuestionEntity, (question) => question.options)
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;
}
