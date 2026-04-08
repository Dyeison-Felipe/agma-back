import { IsBoolean, IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  userId: string;

  @IsBoolean()
  active: boolean

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsUUID()
  roleId: string;
}
