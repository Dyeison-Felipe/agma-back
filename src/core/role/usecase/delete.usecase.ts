import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { RoleRepository } from '../role.interface';

type Input = { roleId: string };

type Output = void;

export class DeleteRoleUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  @Transactional()
  async execute({ roleId }: Input): Promise<Output> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundError(`Cargo não encontrado`);
    }

    await this.roleRepository.delete(role.id);
  }
}
