import { QuestionOutput } from '@/shared/output/question/question.output';

export type QuestionOptionsOutput = {
  id: string;
  option: string;
  question: QuestionOutput;
  allowsCustomText: boolean;
};
