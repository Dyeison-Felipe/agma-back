import { UserRepository } from '@/core/user/user.interface';
import { AuthConstants } from '@/shared/constants/auth';
import { CookieOptions } from '@/shared/cookies/cookies';
import { EnvConfigService } from '@/shared/env-config/env-config.interface';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import { HashService } from '@/shared/hash/hash.interface';
import { JwtService } from '@/shared/jwt/jwt.interface';
import { LoginOutput } from '@/shared/output/login/login.output';
import { UseCase } from '@/shared/usecase/usecase';

type Input = {
  email: string;
  password: string;
  setCookie: (key: string, value: string, options?: CookieOptions) => void;
};

type Output = LoginOutput;

export class LoginUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async execute({ email, password, setCookie }: Input): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.active) {
      throw new UnauthorizedError(`Usuário ou senha invalido`);
    }

    const comparePassword = this.hashService.compareHash(
      password,
      user.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedError(`Usuário ou senha invalido`);
    }

    const { token } = await this.jwtService.generateJwt(user);

    const jwtExpiresInSeconds = this.envConfigService.getJwtExpiresInSeconds();

    const options: CookieOptions = {
      httpOnly: true,
      maxAge: jwtExpiresInSeconds,
      path: '/',
      // domain: this.envConfigService.getCookieDomain(),
      secure: this.envConfigService.getCookieSecure(),
      sameSite: this.envConfigService.getCookieSameSite(),
    };

    setCookie(AuthConstants.tokenName, token, options);

    const output: Output = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        active: user.active,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
      },
    };

    return output;
  }
}
