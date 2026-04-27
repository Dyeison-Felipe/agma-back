import { UserEntity } from '@/core/user/entities/user.entity';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {
  GenerateJwtToken,
  JwtService,
  Options,
  Payload,
} from './jwt.interface';

export class JwtServiceImpl implements JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async verifyJwt(jwt: string): Promise<Payload | null> {
    try {
      return await this.jwtService.verifyAsync<Payload>(jwt);
    } catch (error) {
      return null;
    }
  }

  async generateJwtWithCustomPayload<T extends Record<string, unknown>>(
    payload: T,
    options?: Options,
  ): Promise<GenerateJwtToken> {
    const token = await this.jwtService.signAsync(payload, { ...options });

    return { token };
  }

  decodeJwt(jwt: string): Payload {
    return this.jwtService.decode<Payload>(jwt);
  }

  async generateJwt(
    user: UserEntity,
    options: Options,
  ): Promise<GenerateJwtToken> {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload, { ...options });

    return { token };
  }
}
