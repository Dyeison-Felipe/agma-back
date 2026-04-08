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
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { RolesGuard } from './core/auth/guard/role.guard';
import { JwtService } from './shared/jwt/jwt.interface';
import { UserRepository } from './core/user/user.interface';
import { LoggedUserService } from './shared/logged-user/logged-user.interface';
import { PROVIDERS } from './shared/constants/providers';

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {}
