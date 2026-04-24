import { QuestionEntity } from "@/core/questions/entities/question.entity";
import { BaseSchema } from "@/shared/database/schema/base-schema";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('questionoptions')
export class QuestionOptionEntity extends BaseSchema{
  @Column({ name: 'option', nullable: false})
  option: string;

  @OneToMany(() => QuestionEntity, (question) => question.questionOption)
  question: QuestionEntity[];
}
