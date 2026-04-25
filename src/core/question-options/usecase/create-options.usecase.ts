import { QuestionOptionsRepository } from '@/core/question-options/question-options.interface';
import { QuestionRepository } from '@/core/questions/question.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { ConflictError } from '@/shared/errors/conflict-error';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { QuestionOptionsOutput } from '@/shared/output/question-options/question-options.output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

type Input = {
  questionId: string;
  option: string;
};

type Output = QuestionOptionsOutput;

export class CreateQuestionOptionsUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.QUESTION_OPTIONS_REPOSITORY)
    private readonly questionOptionsRepository: QuestionOptionsRepository,
    @Inject(PROVIDERS.QUESTION_REPOSITORY)
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute({ option, questionId }: Input): Promise<Output> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw new NotFoundError(`Pergunta não encontrado`);
    }

    const existOption =
      await this.questionOptionsRepository.findByQuestionOption(
        option,
        question.id,
      );

    if (existOption) {
      throw new ConflictError(`Essa opção já existe para essa pergunta`);
    }

    const createQuestionOption = await this.questionOptionsRepository.save({
      id: crypto.randomUUID(),
      option: option,
      question: question,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const output: Output = {
      id: createQuestionOption.id,
      option: createQuestionOption.option,
      question: createQuestionOption.question,
    };

    return output;
  }
}
