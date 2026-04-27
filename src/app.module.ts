import { FormsModule } from '@/core/forms/forms.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './core/auth/auth.module';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { RolesGuard } from './core/auth/guard/role.guard';
import { AutisticChildModule } from './core/autistic/autistic-child.module';
import { FamilyModule } from './core/family/family.module';
import { QuestionOptionsModule } from './core/question-options/question-options.module';
import { QuestionsModule } from './core/questions/questions.module';
import { RoleModule } from './core/role/role.module';
import { StorageModule } from './core/storage/storage.module';
import { TransparencyPortalModule } from './core/transparency-portal/transparency-portal.module';
import { TransparencyTypeModule } from './core/transparency-type/transparency-type.module';
import { TypeQuestionModule } from './core/type-question/type-question.module';
import { UserModule } from './core/user/user.module';
import { DatabaseModule } from './shared/database/database.module';
import { EnvConfigModule } from './shared/env-config/env-config.module';
import { HashModule } from './shared/hash/hash.module';
import { JwtConfigModule } from './shared/jwt/jwt.module';
import { LoggedUserModule } from './shared/logged-user/logged-user.module';

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
    AuthModule,
    QuestionsModule,
    QuestionOptionsModule,
    TypeQuestionModule,
    FamilyModule,
    AutisticChildModule,
    FormsModule,
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
    },
  ],
})
export class AppModule {}
