import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
