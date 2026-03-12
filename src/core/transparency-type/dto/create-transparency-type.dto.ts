import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateTransparencyTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;
}
