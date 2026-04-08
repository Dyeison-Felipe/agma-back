import { UserEntity } from "@/core/user/entities/user.entity";

export type GenerateJwtToken = {
  token: string;
};

export type Options = {
  secret?: string;
  expiresIn?: number;
};

export type Payload = {
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
};

export interface JwtService {
  generateJwt(user: UserEntity, options?: Options): Promise<GenerateJwtToken>;
  decodeJwt(jwt: string): Payload;
  verifyJwt(jwt: string): Promise<Payload | null>;
}