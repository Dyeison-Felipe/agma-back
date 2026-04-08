import { UserRepository } from '@/core/user/user.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import { JwtService } from '@/shared/jwt/jwt.interface';
import { LoggedUserService } from '@/shared/logged-user/logged-user.interface';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(PROVIDERS.JWT_SERVICE) private readonly jwtService: JwtService,
    @Inject(PROVIDERS.USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PROVIDERS.LOGGED_USER_SERVICE) private readonly loggedUserService: LoggedUserService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const token = request.cookies?.developmentAuthToken;
    // const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Invalid token');
    }

    try {
      const payload = await this.jwtService.verifyJwt(token);
      console.log("🚀 ~ AuthGuard ~ canActivate ~ payload:", payload)
      // pegar o usuário e colcoar na request

      if(!payload) return false

      const user = await this.userRepository.findById(payload?.sub);

      if(!user) {
        throw new UnauthorizedError(`user NotFound`);
      }

      request.user = user;

      this.loggedUserService.setLoggedUser(user);
      
      return true;
    } catch (error) {
      console.error(error)
      throw new UnauthorizedError(`Not authorized ${error}`);
    }
  }
}
