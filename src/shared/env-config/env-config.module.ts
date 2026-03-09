import { Global, Module } from '@nestjs/common';
import { PROVIDERS } from '../constants/providers';
import { EnvConfigServiceImpl } from './env-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: PROVIDERS.ENV_CONFIG_SERVICE,
      useFactory: (configService: ConfigService) => {
        return new EnvConfigServiceImpl(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [PROVIDERS.ENV_CONFIG_SERVICE],
})
export class EnvConfigModule {}
