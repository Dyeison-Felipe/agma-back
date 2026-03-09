import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PROVIDERS } from './shared/constants/providers';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const envConfig = app.get(PROVIDERS.ENV_CONFIG_SERVICE);

  await app.listen(envConfig.getPort() ?? '0.0.0.0');

  console.log(`Running in port ${envConfig.getPort() ?? '0.0.0.0'}`)
}
bootstrap();
