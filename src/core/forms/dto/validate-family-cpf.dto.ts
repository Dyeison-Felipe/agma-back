import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateFamilyDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
