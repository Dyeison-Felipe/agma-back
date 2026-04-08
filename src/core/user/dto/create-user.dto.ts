import { IsEmail, IsString, IsUUID, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsUUID()
  roleId: string;
}
