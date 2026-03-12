import { FileDto } from "@/shared/dto/file.dto";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTransparencyPortalDto {

  @IsString()
  transparencyType: string;

}

export class CreateTransparencyPortalMultipartDto {
  @IsNotEmpty()
  dto: CreateTransparencyPortalDto;

  @IsNotEmpty()
  pdf: FileDto;
}
