import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateTransparencyTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({
    description: 'Nome do tipo de transparência',
    example: 'Atividades',
    required: true,
    nullable: false
  })
  name: string;
}
