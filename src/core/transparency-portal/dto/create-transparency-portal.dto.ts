import { IsString, IsUUID } from "class-validator";

export class CreateTransparencyPortalDto {

  @IsUUID()
  transparencyType: string;
}
