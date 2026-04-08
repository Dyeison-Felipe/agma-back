import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { HashModule } from '@/shared/hash/hash.module';
import { JwtConfigModule } from '@/shared/jwt/jwt.module';
import { EnvConfigModule } from '@/shared/env-config/env-config.module';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './usecase/login.usecase';
import { JwtService } from '@/shared/jwt/jwt.interface';
import { UserRepository } from '../user/user.interface';
import { HashService } from '@/shared/hash/hash.interface';
import { EnvConfigService } from '@/shared/env-config/env-config.interface';
import { PROVIDERS } from '@/shared/constants/providers';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/role.guard';

@Global()
@Module({
  imports: [UserModule, HashModule, JwtConfigModule, EnvConfigModule],
  controllers: [AuthController],
  providers: [
    Reflector,
    {
      provide: LoginUseCase,
      useFactory: (
        jwtService: JwtService,
        userRepository: UserRepository,
        hasService: HashService,
        envConfigService: EnvConfigService,
      ) => {
        return new LoginUseCase(
          jwtService,
          userRepository,
          hasService,
          envConfigService,
        );
      },
      inject: [
        PROVIDERS.JWT_SERVICE,
        PROVIDERS.USER_REPOSITORY,
        PROVIDERS.HASH_SERVICE,
        PROVIDERS.ENV_CONFIG_SERVICE,
      ],
    },
  ],
  exports: [Reflector ]
})
export class AuthModule {}
