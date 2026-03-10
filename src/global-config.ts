import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { EnvConfigService } from "./shared/env-config/env-config.interface";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import multipart from "@fastify/multipart"

export async function globalConfig(
  app: NestFastifyApplication,
  envConfig: EnvConfigService,
) {

  // PREFIX
  app.setGlobalPrefix('/api')

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Agma')
    .setDescription('Api Agma')
    .setVersion('1.0')
    .addTag('Agma')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);


  const origins = envConfig.getAllowedOrigins();
  app.enableCors({
    origin: origins,
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // GLOBAL PIPES
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.register(multipart)

}