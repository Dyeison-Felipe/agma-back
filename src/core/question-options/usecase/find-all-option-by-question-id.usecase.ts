import { QuestionOptionsRepository } from '@/core/question-options/question-options.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { FindAllOptionsByQuestion } from '@/shared/output/question-options/find-all-options-by-question.output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

type Input = void;

type Output = FindAllOptionsByQuestion[];

export class FindAllOptionsByQuestionUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.QUESTION_OPTIONS_REPOSITORY)
    private readonly questionOptionsRepository: QuestionOptionsRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const options = await this.questionOptionsRepository.findAll();

    if (!options.length) {
      throw new NotFoundError(`Nenhuma opção encontrada`);
    }

    const grouped = options.reduce(
      (acc, item) => {
        const questionId = item.question.id;

        if (!acc[questionId]) {
          acc[questionId] = {
            id: item.id,
            question: {
              id: item.question.id,
              question: item.question.question,
              typeQuestion: item.question.typeQuestion,
            },
            options: [],
          };
        }

        acc[questionId].options.push(item.option);

        return acc;
      },
      {} as Record<string, FindAllOptionsByQuestion>,
    );

    return Object.values(grouped);
  }
}
