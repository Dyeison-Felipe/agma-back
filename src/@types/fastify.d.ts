import { UserEntity } from '@core/user/domain/entities/user.entity';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserEntity; // pode tipar melhor depois
  }
}
