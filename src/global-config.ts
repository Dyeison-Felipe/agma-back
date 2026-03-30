import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { EnvConfigService } from "./shared/env-config/env-config.interface";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import multipart from "@fastify/multipart"
import { BadRequestErrorFilter } from "./shared/exeption-filters/bad-request-error.filter";
import { ConflictErrorFilter } from "./shared/exeption-filters/conflict-error.filter";
import { ForbiddenErrorFilter } from "./shared/exeption-filters/forbidden-error.filter";
import { NotFoundErrorFilter } from "./shared/exeption-filters/not-found-error.filter";
import { UnauthorizedErrorFilter } from "./shared/exeption-filters/unauthorized-error.filter";

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
    .addTag('Agma, Ong')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  // CORS
  // const origins = envConfig.getAllowedOrigins();
  // app.enableCors({
  //   origin: origins,
  //   methods: 'GET,PUT,POST,DELETE',
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });


  // GLOBAL PIPES
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // MULTIPART
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    }
  });

  // GLOBAL ERRORS
  app.useGlobalFilters(
    new BadRequestErrorFilter(),
    new ConflictErrorFilter(),
    new ForbiddenErrorFilter(),
    new NotFoundErrorFilter(),
    new UnauthorizedErrorFilter(),
  );

}