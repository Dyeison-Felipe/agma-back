import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { RoleOutput } from '@/shared/output/role/role-output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { RoleRepository } from '../role.interface';

type Input = { id: string; name: string };

type Output = RoleOutput;

export class UpdateRoleUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  @Transactional()
  async execute({ id, name }: Input): Promise<Output> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundError(`Cargo não encontrado`);
    }

    if (role.name === name) {
      return role;
    }

    role.name = name;

    const updatedRole = await this.roleRepository.update(role);

    const output: Output = {
      id: updatedRole.id,
      name: updatedRole.name,
    };

    return output;
  }
}
