import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { initializeSwagger } from './configs/swagger/initializeSwagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  initializeSwagger(app);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3002;
  const NODE_ENV = configService.get('NODE_ENV');
  if (NODE_ENV === 'local') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: [/.*\.stralom\.com$/],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });
  }

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`🚀 Application started at port ${port}`);
}
bootstrap();
