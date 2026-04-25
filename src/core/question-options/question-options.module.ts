import { QuestionOptionEntity } from '@/core/question-options/entities/question-option.entity';
import { QuestionOptionsRepository } from '@/core/question-options/question-options.interface';
import { QuestionOptionsRepositoryImpl } from '@/core/question-options/question-options.repository';
import { CreateQuestionOptionsUseCase } from '@/core/question-options/usecase/create-options.usecase';
import { FindAllOptionsByQuestionUseCase } from '@/core/question-options/usecase/find-all-option-by-question-id.usecase';
import { QuestionRepository } from '@/core/questions/question.interface';
import { QuestionsModule } from '@/core/questions/questions.module';
import { PROVIDERS } from '@/shared/constants/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionOptionsController } from './question-options.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionOptionEntity]), QuestionsModule],
  controllers: [QuestionOptionsController],
  providers: [
    {
      provide: PROVIDERS.QUESTION_OPTIONS_REPOSITORY,
      useClass: QuestionOptionsRepositoryImpl,
    },
    {
      provide: CreateQuestionOptionsUseCase,
      useFactory: (
        questionOptionsRepository: QuestionOptionsRepository,
        questionRepository: QuestionRepository,
      ) => {
        return new CreateQuestionOptionsUseCase(
          questionOptionsRepository,
          questionRepository,
        );
      },
      inject: [
        PROVIDERS.QUESTION_OPTIONS_REPOSITORY,
        PROVIDERS.QUESTION_REPOSITORY,
      ],
    },
    {
      provide: FindAllOptionsByQuestionUseCase,
      useFactory: (questionOptionsRepository: QuestionOptionsRepository) => {
        return new FindAllOptionsByQuestionUseCase(questionOptionsRepository);
      },
      inject: [PROVIDERS.QUESTION_OPTIONS_REPOSITORY],
    },
  ],
  exports: [PROVIDERS.QUESTION_OPTIONS_REPOSITORY],
})
export class QuestionOptionsModule {}
