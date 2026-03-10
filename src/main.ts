import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PROVIDERS } from './shared/constants/providers';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { globalConfig } from './global-config';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const envConfig = app.get(PROVIDERS.ENV_CONFIG_SERVICE);

  globalConfig(app, envConfig)

  await app.listen(envConfig.getPort() ?? '0.0.0.0');

  console.log(`Running in port ${envConfig.getPort() ?? '0.0.0.0'}`)
}
bootstrap();
