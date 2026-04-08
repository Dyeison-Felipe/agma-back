import { PROVIDERS } from '@/shared/constants/providers';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../user.interface';
import { UserOutput } from '@/shared/output/user/create-user.output';
import { NotFoundError } from '@/shared/errors/not-found-error';

type Input = { idUser: string };

type Output = void;

export class DeleteUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute({idUser}: Input): Promise<Output> {
    const user = await this.userRepository.findById(idUser);

    if (!user) {
      throw new NotFoundError(`Nenhum usuário encontrado`);
    }

    user.active = false
    user.deletedAt = new Date()

    await this.userRepository.update(user)
  }
}
