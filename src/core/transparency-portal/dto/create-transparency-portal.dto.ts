import { FileDto } from "@/shared/dto/file.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTransparencyPortalDto {

  @IsString()
  @ApiProperty({
      description: 'Id do tipo de transparência',
      example: '311b8ccd-0000-0000-0000-0b552f019bfa',
      required: true,
      nullable: false
    })
  id: string;
}

export class CreateTransparencyPortalMultipartDto {
  @IsNotEmpty()
  @ApiProperty({
      description: 'Referencia do tipo de transparência',
      type: CreateTransparencyPortalDto
    })
  transparencyType: CreateTransparencyPortalDto;

  @IsNotEmpty()
  @ApiProperty({
      description: 'Arquivo a ser enviado',
      required: true,
      nullable: false,
      type: FileDto
    })
  pdf: FileDto;
}
