import { TypeQuestionEntity } from '@/core/type-question/entities/type-question.entity';

export interface TypeQuestionRepository {
  findAll(): Promise<TypeQuestionEntity[]>;
  findById(id: string): Promise<TypeQuestionEntity | null>;
  findByType(type: string): Promise<TypeQuestionEntity | null>;
}
