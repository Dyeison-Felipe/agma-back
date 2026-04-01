import { ApiProperty } from "@nestjs/swagger";
import { CreateTransparencyTypePresenter } from "../transparency-type/create-transparency-type.presenter";

export class FindAllTransparencyPortalPaginatedPresenter {
  @ApiProperty({
      description: 'Id da Transparência',
      example: '311b8ccd-0000-0000-0000-0b552f019bfa',
       type: String,
    })
    id: string;

    @ApiProperty({
      description: 'Url do arquivo da transparência',
      example: 'https://supabase.nome_do_arquivo.extensao',
       type: String,
    })
    path: string;

    @ApiProperty({
      description: 'Nome do arquivo da Transparência',
      example: 'nome_do_arquivo',
       type: CreateTransparencyTypePresenter,
    })
    filename: string;
}