import { PROVIDERS } from '@/shared/constants/providers';
import { EnvConfigService } from '@/shared/env-config/env-config.interface';
import { EnvConfigModule } from '@/shared/env-config/env-config.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvConfigModule],
      useFactory: async (configService: EnvConfigService) => ({
        type: 'postgres',
        host: configService.getDbHost(),
        port: configService.getDbPort(),
        username: configService.getDbUsername(),
        password: configService.getDbPassword(),
        database: configService.getDbName(),
        entities: [`${__dirname}/../../core/**/entities/{.ts,*.js}`],
        migrations: [`${__dirname}/migrations/{.ts,*.js}`],
        migrationsRun: configService.getMigrationRun(),
        synchronize: false,
        logging: configService.getDbLogs(),
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [PROVIDERS.ENV_CONFIG_SERVICE],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
