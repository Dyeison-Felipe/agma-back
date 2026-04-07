import { UseCase } from '@/shared/usecase/usecase';
import { RoleRepository } from '../role.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Inject } from '@nestjs/common';
import { NotFoundError } from '@/shared/errors/not-found-error';

type Input = { roleId: string };

type Output = void;

export class DeleteRoleUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute({ roleId }: Input): Promise<Output> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundError(`Cargo não encontrado`);
    }

    await this.roleRepository.delete(role.id);
  }
}
