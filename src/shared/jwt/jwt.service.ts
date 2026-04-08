import { UserEntity } from "@/core/user/entities/user.entity";
import { GenerateJwtToken, JwtService, Options, Payload } from "./jwt.interface";
import { JwtService as NestJwtService } from '@nestjs/jwt';


export class JwtServiceImpl implements JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async verifyJwt(jwt: string): Promise<Payload | null> {
    try {
      return await this.jwtService.verifyAsync<Payload>(jwt);
    } catch (error) {
      return null;
    }
  }

  decodeJwt(jwt: string): Payload {
    return this.jwtService.decode<Payload>(jwt);
  }

  async generateJwt(
    user: UserEntity,
    options : Options,
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
