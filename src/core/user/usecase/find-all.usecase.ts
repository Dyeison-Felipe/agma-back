import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../user.interface';
import { UserOutput } from '@/shared/output/user/create-user.output';
import { NotFoundError } from '@/shared/errors/not-found-error';

type Input = void;

type Output = UserOutput[];

export class FindAllUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<Output> {
    const users = await this.userRepository.findAll();

    if (!users) {
      throw new NotFoundError(`Nenhum usuário encontrado`);
    }

    const output: Output = users.map((user) => ({
      id: user.id,
      active: user.active,
      email: user.email,
      name: user.name,
      role: user.role,
    }));

    return output;
  }
}
