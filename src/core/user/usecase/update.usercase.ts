import { RoleRepository } from '@/core/role/role.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UserOutput } from '@/shared/output/user/create-user.output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../user.interface';

type Input = {
  userId: string;
  name: string;
  email: string;
  active: boolean;
  roleId: string;
};

type Output = UserOutput;

export class UpdateUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROVIDERS.ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  @Transactional()
  async execute({
    email,
    name,
    roleId,
    userId,
    active,
  }: Input): Promise<Output> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(`Usuário não encontrado`);
    }

    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundError(`Cargo não encontrado`);
    }

    user.email = email;
    user.name = name;
    user.active = active;
    user.role = role;

    const updateUser = await this.userRepository.update(user);

    const output: Output = {
      id: updateUser.id,
      name: updateUser.name,
      email: updateUser.email,
      active: updateUser.active,
      role: updateUser.role,
    };

    return output;
  }
}
