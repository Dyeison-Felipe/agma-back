import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class FileDto {
  @ApiProperty({ description: 'Buffer do arquivo' })
  @IsObject()
  buffer: Buffer;

  @ApiProperty({ description: 'Nome do arquivo' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'Extensão do arquivo' })
  @IsString()
  @IsNotEmpty()
  extension: string;
}