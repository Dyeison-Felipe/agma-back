import { StorageModule } from './core/storage/storage.module';
import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/env-config/env-config.module';
import { DatabaseModule } from './shared/database/database.module';
import { TransparencyPortalModule } from './core/transparency-portal/transparency-portal.module';
import { TransparencyTypeModule } from './core/transparency-type/transparency-type.module';
import { RoleModule } from './core/role/role.module';
import { UserModule } from './core/user/user.module';
import { HashModule } from './shared/hash/hash.module';
import { JwtConfigModule } from './shared/jwt/jwt.module';
import { LoggedUserModule } from './shared/logged-user/logged-user.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [
    StorageModule,
    EnvConfigModule,
    DatabaseModule,
    TransparencyPortalModule,
    TransparencyTypeModule,
    RoleModule,
    UserModule,
    HashModule,
    JwtConfigModule,
    LoggedUserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
