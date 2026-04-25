import { CreateQuestionUseCase } from '@/core/questions/usecase/create-question.usecase';
import { Public } from '@/shared/decorators/public.decorator';
import { CreateQuestionPresenter } from '@/shared/presenters/question/create-question.presenter';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('/v1/question')
export class QuestionsController {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @Public()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<CreateQuestionPresenter> {
    return await this.createQuestionUseCase.execute(createQuestionDto);
  }
}
