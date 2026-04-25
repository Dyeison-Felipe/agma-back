import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateQuestionDto {
  @IsUUID()
  type_question_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  question: string;
}
