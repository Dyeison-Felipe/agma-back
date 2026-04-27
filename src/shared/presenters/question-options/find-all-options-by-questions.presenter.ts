import { QuestionPresenter } from '@/shared/presenters/question/question.presenter';

export class QuestionOptionPresenter {
  value: string;
  allowsCustomText: boolean;
}

export class FindAllOptionsByQuestionPresenter {
  id: string;
  question: QuestionPresenter;
  options: QuestionOptionPresenter[];
}
