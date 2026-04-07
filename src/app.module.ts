import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/env-config/env-config.module';
import { DatabaseModule } from './shared/database/database.module';
import { TransparencyPortalModule } from './core/transparency-portal/transparency-portal.module';
import { TransparencyTypeModule } from './core/transparency-type/transparency-type.module';
import { RoleModule } from './core/role/role.module';
import { UserModule } from './core/user/user.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, TransparencyPortalModule, TransparencyTypeModule, RoleModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
