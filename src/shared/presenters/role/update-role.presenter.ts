import { ApiProperty } from "@nestjs/swagger";

export class UpdateRolePresenter {
  @ApiProperty({
    description: 'Id da role',
    example: '311b8ccd-0000-0000-0000-0b552f019bfa',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Nome da role',
    example: 'Admin',
    type: String,
  })
  name: string;
}
