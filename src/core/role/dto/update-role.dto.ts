import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Id do tipo do cargo',
    example: 'c6f6360b-3bed-4c13-9c4f-62f4c14898a0',
    required: true,
    nullable: false,
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Nome do tipo do cargo',
    example: 'Admin',
    required: true,
    nullable: false,
  })
  name: string;
}
