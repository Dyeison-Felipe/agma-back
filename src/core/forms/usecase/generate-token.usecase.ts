import { FamilyRepository } from '@/core/family/family.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Transactional } from '@/shared/decorators/transactional.decorator';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { JwtService } from '@/shared/jwt/jwt.interface';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

export type Input = {
  id: string;
};

export type Output = {
  token: string;
};

export class GenerateTokenUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.FAMILY_REPOSITORY)
    private readonly familyRepository: FamilyRepository,
    @Inject(PROVIDERS.JWT_SERVICE) private readonly jwtService: JwtService,
  ) {}

  @Transactional()
  async execute({ id }: Input): Promise<Output> {
    const family = await this.familyRepository.findById(id);

    if (!family) {
      throw new NotFoundError(`Família não encontrada`);
    }

    const { token } = await this.jwtService.generateJwtWithCustomPayload({
      sub: family.id,
    });

    family.updateToken = token;

    await this.familyRepository.update(family);

    return { token };
  }
}
