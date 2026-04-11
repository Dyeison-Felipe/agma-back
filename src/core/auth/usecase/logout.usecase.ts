import { AuthConstants } from '@/shared/constants/auth';
import { PROVIDERS } from '@/shared/constants/providers';
import { CookieOptions } from '@/shared/cookies/cookies';
import { EnvConfigService } from '@/shared/env-config/env-config.interface';
import { UseCase } from '@/shared/usecase/usecase';
import { Inject } from '@nestjs/common';

type Input = {
  clearCookie: (key: string, options: CookieOptions) => void;
};

type Output = void;

export class LogoutUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PROVIDERS.ENV_CONFIG_SERVICE)
    private readonly envConfigService: EnvConfigService,
  ) {}

  async execute({ clearCookie }: Input): Promise<Output> {
    clearCookie(AuthConstants.tokenName, {
      httpOnly: true,
      maxAge: this.envConfigService.getJwtExpiresInSeconds(),
      path: '/',
      domain: this.envConfigService.getCookieDomain(),
      secure: this.envConfigService.getCookieSecure(),
      sameSite: this.envConfigService.getCookieSameSite(),
    });
  }
}
