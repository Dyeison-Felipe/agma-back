import { RoleRepository } from '@/core/role/role.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { ConflictError } from '@/shared/errors/conflict-error';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { HashService } from '@/shared/hash/hash.interface';
import { UserOutput } from '@/shared/output/user/create-user.output';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../user.interface';

type Input = {
  name: string;
  email: string;
  password: string;
  roleId: string;
};

type Output = UserOutput;

export class CreateUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROVIDERS.ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
    @Inject(PROVIDERS.HASH_SERVICE)
    private readonly hashService: HashService,
  ) {}

  @Transactional()
  async execute({ email, name, password, roleId }: Input): Promise<Output> {
    const existUser = await this.userRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictError(
        `Já existe um usuário com o e-mail ${existUser.email}`,
      );
    }

    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundError(`Cargo não encontrado`);
    }

    const hashPassword = await this.hashService.hash(password);

    const newUser = await this.userRepository.create({
      id: crypto.randomUUID(),
      name,
      email,
      active: true,
      password: hashPassword,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!hashPassword) {
      throw new BadRequestError(`Ocorreu um erro, tente novamente mais tarde`);
    }

    const output: Output = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      active: newUser.active,
      role: newUser.role,
    };

    return output;
  }
}
