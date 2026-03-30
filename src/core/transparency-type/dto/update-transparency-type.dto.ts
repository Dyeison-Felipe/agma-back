import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransparencyTypeDto } from './create-transparency-type.dto';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateTransparencyTypeDto {

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @ApiProperty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({
    description: 'Nome do tipo de transparência',
    example: 'Atividades',
    required: true,
    nullable: false,
  })
  name: string;
}
