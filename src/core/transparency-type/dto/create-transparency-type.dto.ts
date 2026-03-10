import { IsNotEmpty, IsString, Max } from 'class-validator';

export class CreateTransparencyTypeDto {
  @IsString()
  @IsNotEmpty()
  @Max(150)
  name: string;
}
