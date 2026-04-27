import { UserEntity } from '@/core/user/entities/user.entity';

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

export type CustomPayload<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  sub: string;
  iat: number;
  exp: number;
} & T;

export interface JwtService {
  generateJwt(user: UserEntity, options?: Options): Promise<GenerateJwtToken>;
  generateJwtWithCustomPayload<T extends Record<string, unknown>>(
    payload: T,
    options?: Options,
  ): Promise<GenerateJwtToken>;
  decodeJwt(jwt: string): Payload;
  verifyJwt(jwt: string): Promise<Payload | null>;
}
