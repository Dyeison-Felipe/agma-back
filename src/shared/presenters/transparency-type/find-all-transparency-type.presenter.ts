import { ApiProperty } from "@nestjs/swagger";

export class FindAllTransparencyTypePresenter {

  @ApiProperty({
  description: 'Data de atualização do tipo de transparência',
  example: '311b8ccd-0000-0000-0000-0b552f019bfa',
  type: String,
})
  id: string;

  @ApiProperty({
    description: 'Nome do tipo de transparência',
    example: 'Atividades',
     type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Data de criação do tipo de transparência',
    example: '2023-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do tipo de transparência',
    example: '2023-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time'
  })
  updatedAt: Date;
}