import { QuestionEntity } from '@/core/questions/entities/question.entity';
import { Repository } from '@/shared/repository/repository';

export interface QuestionRepository extends Repository<QuestionEntity> {
  findByQuestion(question: string): Promise<QuestionEntity | null>;
}
