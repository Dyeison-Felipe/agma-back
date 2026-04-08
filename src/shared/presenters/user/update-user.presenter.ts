// update-user.presenter.ts
import { ApiProperty } from '@nestjs/swagger';
import { RolePresenter } from '../role/role.presenter';

export class UpdateUserPresenter {
  @ApiProperty({
    description: 'ID do usuário',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Status do usuário',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Role do usuário',
    type: () => RolePresenter,
  })
  role: RolePresenter;
}