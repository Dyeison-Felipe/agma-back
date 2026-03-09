import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/env-config/env-config.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
