import { Module } from '@nestjs/common';
import { EnvConfigModule } from '../env-config/env-config.module';
import { HashServiceImpl } from './hash.service';
import { PROVIDERS } from '../constants/providers';

@Module({
  imports: [EnvConfigModule],
  providers: [
    {
      provide: PROVIDERS.HASH_SERVICE,
      useClass: HashServiceImpl,
    },
  ],
  exports: [PROVIDERS.HASH_SERVICE],
})
export class HashModule {}
