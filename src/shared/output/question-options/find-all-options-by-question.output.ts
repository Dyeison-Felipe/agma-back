import { QuestionOutput } from '@/shared/output/question/question.output';

export type QuestionOption = {
  value: string;
  allowsCustomText: boolean;
};

export type FindAllOptionsByQuestion = {
  id: string;
  question: QuestionOutput;
  options: QuestionOption[];
};
