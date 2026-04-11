import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PROVIDERS } from './shared/constants/providers';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { globalConfig } from './global-config';
import { runSeeds } from './shared/database/seeders/run';
import { DataSource } from 'typeorm';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const envConfig = app.get(PROVIDERS.ENV_CONFIG_SERVICE);
  console.log(`Running in port ${envConfig.getPort()}`);

  await globalConfig(app, envConfig);

  const dataSource = app.get(DataSource);
  await runSeeds(dataSource);

  await app.listen(envConfig.getPort());
}
bootstrap();
