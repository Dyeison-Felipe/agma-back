import { UseCase } from '@/shared/usecase/usecase';
import { RoleRepository } from '../role.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Inject } from '@nestjs/common';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { RoleOutput } from '@/shared/output/role/role-output';

type Input = void;

type Output = RoleOutput[];

export class FindAllRoleUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const roles = await this.roleRepository.findAll();

    if (!roles) {
      throw new NotFoundError(`Nenhum Cargo não encontrado`);
    }

    const output: Output = roles.map((role) => ({
      id: role.id, 
      name: role.name,
    }))

    return output
  }
}
