import { QuestionOptionEntity } from '@/core/question-options/entities/question-option.entity';
import { Repository } from '@/shared/repository/repository';

export interface QuestionOptionsRepository extends Repository<QuestionOptionEntity> {
  findByQuestionOption(
    option: string,
    questionId: string,
  ): Promise<QuestionOptionEntity | null>;
}
