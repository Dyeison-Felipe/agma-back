import { ApiProperty } from '@nestjs/swagger';
import { UserPresenter } from '../user/user.presenter';

export class LoginPresenter {
  @ApiProperty({
    description: 'Informações do usuário que realizou a autenticação',
  })
  user: UserPresenter;
}
