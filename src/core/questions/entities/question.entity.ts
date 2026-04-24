import { QuestionOptionEntity } from "@/core/question-options/entities/question-option.entity";
import { BaseSchema } from "@/shared/database/schema/base-schema";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('questions')
export class QuestionEntity extends BaseSchema {
  @Column({ name: 'question'})
  question: string;

  @ManyToOne(() => QuestionOptionEntity, (questionOption) => questionOption.question )
  questionOption: QuestionOptionEntity
}
