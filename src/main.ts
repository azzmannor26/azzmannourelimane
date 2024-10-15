import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './libs/common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './libs/common/exceptions/all-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerEnum } from './core/enums';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './libs/logger';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'development';
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log', 'debug', 'verbose']
    : ['error', 'warn', 'log'];

  const app = await NestFactory.create(AppModule, { logger: logLevels });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  //cors
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get('FRONTEND_URL');

  const cors = {
    origin: [
      'http://localhost:3010',
      'https://localhost:3010',
      'http://localhost:3000',
      frontendUrl,
    ],
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
  };
  app.enableCors(cors);

  // ValidationPipe swagger
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));

  // swagger implementation
  const config = new DocumentBuilder()
    .setTitle(SwaggerEnum.TITLE)
    .setDescription(SwaggerEnum.DESCRIPTION)
    .setVersion(SwaggerEnum.VERSION)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addServer('http://localhost:3010/', 'localhost')
    .addServer('http://khaldoun:3000/', 'Example of Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SwaggerEnum.PATH, app, document);

  const port = process.env.PORT ?? 3010;

  await app.listen(port, '0.0.0.0');
  const logger = await app.resolve(LoggerService);
  logger.setContext('Bootstrap ');
  logger.verbose(`Server launched, HTTP on : http://localhost:${port}/}`);
}

bootstrap().catch((err) => {
  throw err;
});
