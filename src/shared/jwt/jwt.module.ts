import { JwtModule, JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtServiceImpl } from './jwt.service';
import { PROVIDERS } from '../constants/providers';
import { Global, Module } from '@nestjs/common';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvConfigService } from '../env-config/env-config.interface';

@Global()
@Module({
  imports: [
    EnvConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [EnvConfigModule],
      useFactory: async (configService: EnvConfigService) => ({
        secret: configService.getJwtSecret(),
        signOptions: {
          expiresIn: configService.getJwtExpiresInSeconds(),
        },
      }),
      inject: [PROVIDERS.ENV_CONFIG_SERVICE],
    }),
  ],
  providers: [
    {
      provide: PROVIDERS.JWT_SERVICE,
      useFactory: (nestJwtService: NestJwtService) => {
        return new JwtServiceImpl(nestJwtService);
      },
      inject: [NestJwtService],
    },
  ],
  exports: [PROVIDERS.JWT_SERVICE],
})
export class JwtConfigModule {}
