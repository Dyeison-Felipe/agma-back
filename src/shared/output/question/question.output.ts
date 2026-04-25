import { TypeQuestionOutput } from '@/shared/output/type-question/type-question.output';

export type QuestionOutput = {
  id: string;
  question: string;
  typeQuestion: TypeQuestionOutput;
};
