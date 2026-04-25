import { QuestionEntity } from '@/core/questions/entities/question.entity';
import { QuestionRepository } from '@/core/questions/question.interface';
import { CreateQuestionUseCase } from '@/core/questions/usecase/create-question.usecase';
import { TypeQuestionRepository } from '@/core/type-question/type-question.interface';
import { TypeQuestionModule } from '@/core/type-question/type-question.module';
import { PROVIDERS } from '@/shared/constants/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsRepositoryImpl } from './questions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity]), TypeQuestionModule],
  controllers: [QuestionsController],
  providers: [
    {
      provide: PROVIDERS.QUESTION_REPOSITORY,
      useClass: QuestionsRepositoryImpl,
    },
    {
      provide: CreateQuestionUseCase,
      useFactory: (
        questionRepository: QuestionRepository,
        typeQuestionRepository: TypeQuestionRepository,
      ) => {
        return new CreateQuestionUseCase(
          questionRepository,
          typeQuestionRepository,
        );
      },
      inject: [
        PROVIDERS.QUESTION_REPOSITORY,
        PROVIDERS.TYPE_QUESTION_REPOSITORY,
      ],
    },
  ],
  exports: [PROVIDERS.QUESTION_REPOSITORY],
})
export class QuestionsModule {}
