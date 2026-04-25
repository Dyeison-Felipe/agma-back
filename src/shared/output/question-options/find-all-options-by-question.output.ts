import { QuestionOutput } from '@/shared/output/question/question.output';

export type FindAllOptionsByQuestion = {
  id: string;
  question: QuestionOutput;
  options: string[];
};
