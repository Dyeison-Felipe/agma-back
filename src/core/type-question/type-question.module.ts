import { TypeQuestionEntity } from '@/core/type-question/entities/type-question.entity';
import { TypeQuestionRepositoryImpl } from '@/core/type-question/type-question.repository';
import { PROVIDERS } from '@/shared/constants/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TypeQuestionEntity])],
  controllers: [],
  providers: [
    {
      provide: PROVIDERS.TYPE_QUESTION_REPOSITORY,
      useClass: TypeQuestionRepositoryImpl,
    },
  ],
  exports: [PROVIDERS.TYPE_QUESTION_REPOSITORY],
})
export class TypeQuestionModule {}
