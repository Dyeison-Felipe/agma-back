import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateQuestionOptionDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  option: string;
}
