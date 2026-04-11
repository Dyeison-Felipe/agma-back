import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { ConflictError } from '@/shared/errors/conflict-error';
import { RoleOutput } from '@/shared/output/role/role-output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { RoleRepository } from '../role.interface';

type Input = { name: string };

type Output = RoleOutput;

export class CreateRoleUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  @Transactional()
  async execute({ name }: Input): Promise<Output> {
    const existRole = await this.roleRepository.findByName(name);

    if (existRole) {
      throw new ConflictError(`Já existe um cargo com esse nome`);
    }

    const newRole = await this.roleRepository.create({
      id: crypto.randomUUID(),
      name: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!newRole) {
      throw new BadRequestError(`Ocorreu um erro, tente novamente mais tarde`);
    }

    const output: Output = {
      id: newRole.id,
      name: newRole.name,
    };

    return output;
  }
}
