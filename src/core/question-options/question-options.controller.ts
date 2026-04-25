import { CreateQuestionOptionDto } from '@/core/question-options/dto/create-question-option.dto';
import { CreateQuestionOptionsUseCase } from '@/core/question-options/usecase/create-options.usecase';
import { FindAllOptionsByQuestionUseCase } from '@/core/question-options/usecase/find-all-option-by-question-id.usecase';
import { Public } from '@/shared/decorators/public.decorator';
import { CreateQuestionOptionPresenter } from '@/shared/presenters/question-options/create-question-option.presenter';
import { FindAllOptionsByQuestionPresenter } from '@/shared/presenters/question-options/find-all-options-by-questions.presenter';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('/v1/question-options')
export class QuestionOptionsController {
  constructor(
    private readonly createQuestionOptionsUseCase: CreateQuestionOptionsUseCase,
    private readonly findAllOptionByQuestionUseCase: FindAllOptionsByQuestionUseCase,
  ) {}

  @Post()
  @Public()
  async create(
    @Body() dto: CreateQuestionOptionDto,
  ): Promise<CreateQuestionOptionPresenter> {
    return await this.createQuestionOptionsUseCase.execute(dto);
  }

  @Get()
  @Public()
  async findAllOptions(): Promise<FindAllOptionsByQuestionPresenter[]> {
    return await this.findAllOptionByQuestionUseCase.execute();
  }
}
