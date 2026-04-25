import { QuestionRepository } from '@/core/questions/question.interface';
import { TypeQuestionRepository } from '@/core/type-question/type-question.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { ConflictError } from '@/shared/errors/conflict-error';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { QuestionOutput } from '@/shared/output/question/question.output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

type Input = {
  type_question_id: string;
  question: string;
};

type Output = QuestionOutput;

export class CreateQuestionUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.QUESTION_REPOSITORY)
    private readonly questionRepository: QuestionRepository,
    @Inject(PROVIDERS.TYPE_QUESTION_REPOSITORY)
    private readonly typeQuestionRepository: TypeQuestionRepository,
  ) {}

  async execute({ question, type_question_id }: Input): Promise<Output> {
    const typeQuestion =
      await this.typeQuestionRepository.findById(type_question_id);

    if (!typeQuestion) {
      throw new NotFoundError(`Tipo de pergunta não encontrado`);
    }

    const existQuestion =
      await this.questionRepository.findByQuestion(question);

    if (existQuestion) {
      throw new ConflictError(`Essa pergunta já existe`);
    }

    const createQuestion = await this.questionRepository.save({
      id: crypto.randomUUID(),
      question: question,
      typeQuestion: typeQuestion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const output: Output = {
      id: createQuestion.id,
      question: createQuestion.question,
      typeQuestion: createQuestion.typeQuestion,
    };

    return output;
  }
}
